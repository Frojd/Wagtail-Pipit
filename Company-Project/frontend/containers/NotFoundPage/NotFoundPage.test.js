import { render /* screen */ } from '@testing-library/react';
import NotFoundPage from './';
// import data from './NotFoundPage.data';

describe('<NotFoundPage />', () => {
    it('Renders an empty NotFoundPage', () => {
        render(<NotFoundPage />);
    });

    // it('Renders NotFoundPage with data', () => {
    //     const { container } = render(<NotFoundPage {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
