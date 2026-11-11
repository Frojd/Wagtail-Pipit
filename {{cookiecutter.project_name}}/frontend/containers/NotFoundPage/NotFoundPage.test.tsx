import { render, screen } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';

describe('<NotFoundPage />', () => {
    it('Renders the exception message', () => {
        render(<NotFoundPage exception="Page missing" />);

        expect(screen.getByText('Page missing')).toBeInTheDocument();
    });
});
