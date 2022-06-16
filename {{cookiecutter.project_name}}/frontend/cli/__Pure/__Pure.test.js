import { render, /* screen */ } from '@testing-library/react';
import __Pure from './';
// import data from './__Pure.data';

describe('<__Pure />', () => {
    it('Renders an empty __Pure', () => {
        render(<__Pure />);
    });

    // it('Renders __Pure with data', () => {
    //     const { container } = render(<__Pure {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
