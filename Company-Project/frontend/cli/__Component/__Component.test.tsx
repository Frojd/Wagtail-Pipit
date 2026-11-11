import { render, screen } from '@testing-library/react';
import __Component from './__Component';
import data from './__Component.data';

describe('<__Component />', () => {
    it('Renders the title', () => {
        render(<__Component {...data} />);

        expect(screen.getByText(data.title)).toBeInTheDocument();
    });
});
