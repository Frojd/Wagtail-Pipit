import { render, screen } from '@testing-library/react';
import BasePage from './BasePage';

describe('<BasePage />', () => {
    it('Renders children', () => {
        render(<BasePage>content</BasePage>);

        expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('Renders the GTM noscript fallback when a gtm id is set', () => {
        const { container } = render(
            <BasePage siteSetting={{ gtmId: 'GTM-TEST' }} />
        );

        expect(container.querySelector('noscript').innerHTML).toContain(
            'ns.html?id=GTM-TEST'
        );
    });

    it('Omits GTM without a gtm id', () => {
        const { container } = render(<BasePage siteSetting={{}} />);

        expect(container.querySelector('noscript')).toBeNull();
    });
});
