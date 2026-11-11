import { render, screen } from '@testing-library/react';
import RawHtml from './RawHtml';

describe('<RawHtml />', () => {
    it('Renders the html as markup', () => {
        render(<RawHtml html="<h2>Heading</h2><p>Body</p>" />);

        expect(
            screen.getByRole('heading', { level: 2, name: 'Heading' })
        ).toBeInTheDocument();
        expect(screen.getByText('Body')).toBeInTheDocument();
    });
});
