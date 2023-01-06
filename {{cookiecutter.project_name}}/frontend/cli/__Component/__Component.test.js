import { render, /* screen */ } from '@testing-library/react';
import __Component from './';
// import data from './__Component.data';

describe('<__Component />', () => {
    it('Renders an empty __Component', () => {
        render(<__Component />);
    });

    // it('Renders __Component with data', () => {
    //     const { container } = render(<__Component {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
