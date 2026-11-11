import { render, screen } from '@testing-library/react';
import __Container from './__Container';
import data from './__Container.data';

describe('<__Container />', () => {
    it('Renders the title', () => {
        render(<__Container {...data} />);

        expect(screen.getByText(data.title)).toBeInTheDocument();
    });
});
