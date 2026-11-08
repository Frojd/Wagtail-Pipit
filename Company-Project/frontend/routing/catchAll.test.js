import { render, screen } from '@testing-library/react';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import {
    getPage,
    getPagePreview,
    getRedirect,
    WagtailApiResponseError,
} from '../api/wagtail';
import CatchAllPage, { generateMetadata } from './catchAll';

let mockDraftModeEnabled = false;

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
    WagtailApiResponseError: class extends Error {
        constructor(status, body = '') {
            super(`${status}`);
            this.response = { status, text: async () => body };
        }
    },
}));

jest.mock('../containers/LazyContainers', () => ({
    HomePage: ({ title }) => <h1>{title}</h1>,
    PureHtmlPage: ({ html }) => <pre>{html}</pre>,
}));

const props = {
    params: Promise.resolve({ path: ['about'] }),
    searchParams: Promise.resolve({}),
};

describe('CatchAllPage', () => {
    afterEach(() => jest.resetAllMocks());

    it('Renders the container Wagtail resolves', async () => {
        getPage.mockResolvedValue({
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
        getPage.mockResolvedValue({
            json: { redirect: { destination: '/new/', isPermanent: true } },
        });

        await CatchAllPage(props);

        expect(permanentRedirect).toHaveBeenCalledWith('/new/');
    });

    it('Falls back to a Wagtail redirect when the page is missing', async () => {
        getPage.mockRejectedValue(new WagtailApiResponseError(404));
        getRedirect.mockResolvedValue({
            json: { destination: '/moved/', isPermanent: false },
        });

        await CatchAllPage(props);

        expect(redirect).toHaveBeenCalledWith('/moved/');
    });

    it('Serves not found when neither page nor redirect exists', async () => {
        getPage.mockRejectedValue(new WagtailApiResponseError(404));
        getRedirect.mockRejectedValue(new WagtailApiResponseError(404));

        await CatchAllPage(props);

        expect(notFound).toHaveBeenCalled();
    });

    it('Shows the Django error page on 5xx outside production', async () => {
        getPage.mockRejectedValue(
            new WagtailApiResponseError(500, 'Django traceback')
        );

        render(await CatchAllPage(props));

        expect(screen.getByText('Django traceback')).toBeInTheDocument();
    });

    it('Throws on 5xx in production', async () => {
        const nodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        let ProdCatchAllPage;
        let api;
        jest.isolateModules(() => {
            ProdCatchAllPage = require('./catchAll').default;
            api = require('../api/wagtail');
        });
        process.env.NODE_ENV = nodeEnv;

        api.getPage.mockRejectedValue(new api.WagtailApiResponseError(500));

        await expect(ProdCatchAllPage(props)).rejects.toThrow('500');
    });
});

describe('generateMetadata', () => {
    afterEach(() => {
        jest.resetAllMocks();
        mockDraftModeEnabled = false;
    });

    const pageWithSeo = (title) => ({
        json: {
            componentName: 'HomePage',
            componentProps: {
                seo: { seoHtmlTitle: title, seoMetaDescription: 'Desc' },
            },
        },
    });

    it('Builds metadata from the live page', async () => {
        getPage.mockResolvedValue(pageWithSeo('Live title'));

        const metadata = await generateMetadata(props);

        expect(metadata.title).toBe('Live title');
        expect(getPagePreview).not.toHaveBeenCalled();
    });

    it('Builds metadata from the preview in draft mode', async () => {
        mockDraftModeEnabled = true;
        getPagePreview.mockResolvedValue(pageWithSeo('Draft title'));

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
