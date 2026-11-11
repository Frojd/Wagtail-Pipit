import { render, screen } from '@testing-library/react';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { getPage, getPagePreview, getRedirect } from '../api/wagtail';
import type { ApiResponse, PageData } from '../api/wagtail';
import type { Seo } from '../containers/BasePage';
import CatchAllPage, { generateMetadata } from './catchAll';

let mockDraftModeEnabled = false;

class MockWagtailApiResponseError extends Error {
    readonly response: { status: number; text: () => Promise<string> };

    constructor(status: number, body = '') {
        super(`${status}`);
        this.response = { status, text: async () => body };
    }
}

jest.mock('next/headers', () => ({
    headers: async () => new Headers({ host: 'example.com', cookie: '' }),
    draftMode: async () => ({ isEnabled: mockDraftModeEnabled }),
}));

jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
    permanentRedirect: jest.fn(),
    redirect: jest.fn(),
}));

jest.mock('../api/wagtail', () => ({
    getPage: jest.fn(),
    getPagePreview: jest.fn(),
    getRedirect: jest.fn(),
    // A getter, since the mock factory runs before the class above is initialized
    get WagtailApiResponseError() {
        return MockWagtailApiResponseError;
    },
}));

jest.mock('../containers/LazyContainers', () => ({
    HomePage: ({ title }: { title: string }) => <h1>{title}</h1>,
    PureHtmlPage: ({ html }: { html: string }) => <pre>{html}</pre>,
}));

const props = {
    params: Promise.resolve({ path: ['about'] }),
    searchParams: Promise.resolve({}),
};

describe('CatchAllPage', () => {
    afterEach(() => jest.resetAllMocks());

    it('Renders the container Wagtail resolves', async () => {
        jest.mocked(getPage).mockResolvedValue({
            headers: new Headers(),
            json: {
                componentName: 'HomePage',
                componentProps: { title: 'Hi' },
            },
        });

        render(await CatchAllPage(props));

        expect(screen.getByText('Hi')).toBeInTheDocument();
        expect(getPage).toHaveBeenCalledWith(
            'about',
            { host: 'example.com' },
            expect.anything()
        );
    });

    it('Follows a redirect returned by the page', async () => {
        jest.mocked(getPage).mockResolvedValue({
            headers: new Headers(),
            json: { redirect: { destination: '/new/', isPermanent: true } },
        });

        await CatchAllPage(props);

        expect(permanentRedirect).toHaveBeenCalledWith('/new/');
    });

    it('Falls back to a Wagtail redirect when the page is missing', async () => {
        jest.mocked(getPage).mockRejectedValue(
            new MockWagtailApiResponseError(404)
        );
        jest.mocked(getRedirect).mockResolvedValue({
            headers: new Headers(),
            json: {
                oldPath: '/about/',
                destination: '/moved/',
                isPermanent: false,
            },
        });

        await CatchAllPage(props);

        expect(redirect).toHaveBeenCalledWith('/moved/');
    });

    it('Serves not found when neither page nor redirect exists', async () => {
        jest.mocked(getPage).mockRejectedValue(
            new MockWagtailApiResponseError(404)
        );
        jest.mocked(getRedirect).mockRejectedValue(
            new MockWagtailApiResponseError(404)
        );

        await CatchAllPage(props);

        expect(notFound).toHaveBeenCalled();
    });

    it('Shows the Django error page on 5xx outside production', async () => {
        jest.mocked(getPage).mockRejectedValue(
            new MockWagtailApiResponseError(500, 'Django traceback')
        );

        render(await CatchAllPage(props));

        expect(screen.getByText('Django traceback')).toBeInTheDocument();
    });

    it('Throws on 5xx in production', async () => {
        const nodeEnv = jest.replaceProperty(
            process.env,
            'NODE_ENV',
            'production'
        );

        await jest.isolateModulesAsync(async () => {
            const { default: ProdCatchAllPage } = await import('./catchAll');
            const api = await import('../api/wagtail');
            nodeEnv.restore();

            jest.mocked(api.getPage).mockRejectedValue(
                new MockWagtailApiResponseError(500)
            );

            await expect(ProdCatchAllPage(props)).rejects.toThrow('500');
        });
    });
});

describe('generateMetadata', () => {
    afterEach(() => {
        jest.resetAllMocks();
        mockDraftModeEnabled = false;
    });

    const seo = (title: string): Seo => ({
        seoHtmlTitle: title,
        seoMetaDescription: 'Desc',
        seoOgTitle: title,
        seoOgDescription: 'Desc',
        seoOgUrl: '',
        seoTwitterTitle: title,
        seoTwitterDescription: 'Desc',
        seoMetaRobots: { index: true, follow: true, value: 'index,follow' },
        seoCanonicalLink: '',
    });

    const pageWithSeo = (title: string): ApiResponse<PageData> => ({
        headers: new Headers(),
        json: {
            componentName: 'HomePage',
            componentProps: {
                seo: seo(title),
            },
        },
    });

    it('Builds metadata from the live page', async () => {
        jest.mocked(getPage).mockResolvedValue(pageWithSeo('Live title'));

        const metadata = await generateMetadata(props);

        expect(metadata.title).toBe('Live title');
        expect(getPagePreview).not.toHaveBeenCalled();
    });

    it('Builds metadata from the preview in draft mode', async () => {
        mockDraftModeEnabled = true;
        jest.mocked(getPagePreview).mockResolvedValue(
            pageWithSeo('Draft title')
        );

        const metadata = await generateMetadata({
            params: Promise.resolve({}),
            searchParams: Promise.resolve({
                contentType: 'main.homepage',
                token: 'abc',
                inPreviewPanel: 'true',
            }),
        });

        expect(metadata.title).toBe('Draft title');
        expect(metadata.description).toBe('Desc');
        expect(getPagePreview).toHaveBeenCalledWith(
            'main.homepage',
            'abc',
            { in_preview_panel: true },
            expect.anything()
        );
        expect(getPage).not.toHaveBeenCalled();
    });
});
