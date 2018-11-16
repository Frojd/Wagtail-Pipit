import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import App from './';
// const data = __jsons['App'];

describe('<App />', () => {
    it('Renders an empty App', () => {
        const component = shallow(<App />);
        expect(component).toBeTruthy();
    });

    // it('Renders App with data', () => {
    //     const component = mount(<App {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
