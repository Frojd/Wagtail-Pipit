import { render, screen } from '@testing-library/react';
import BasePage from './BasePage';

// next/head renders nothing in jsdom, so render its children inline and let
// React 19 hoist the resulting title/meta/link elements into document.head
jest.mock('next/head', () => ({
    __esModule: true,
    default: ({ children }) => <>{children}</>,
}));

const seo = {
    seoHtmlTitle: 'Page title',
    seoMetaDescription: 'Page description',
    canonicalLink: 'https://example.com/page/',
};

describe('<BasePage />', () => {
    it('Renders seo tags by default', () => {
        render(<BasePage seo={seo} />);

        const { head } = document;
        expect(head.querySelector('title')).toHaveTextContent('Page title');
        expect(head.querySelector('meta[name="description"]')).toHaveAttribute(
            'content',
            'Page description'
        );
        expect(head.querySelector('link[rel="canonical"]')).toHaveAttribute(
            'href',
            'https://example.com/page/'
        );
    });

    it('Omits seo tags when shouldRenderSeo is false', () => {
        render(<BasePage seo={seo} shouldRenderSeo={false} />);

        expect(document.head.querySelector('title')).toBeNull();
    });

    it('Renders children', () => {
        render(<BasePage>content</BasePage>);

        expect(screen.getByText('content')).toBeInTheDocument();
    });
});
