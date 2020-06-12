import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import HomePage from './';
// import data from './HomePage.data';

describe('<HomePage />', () => {
    it('Renders an empty HomePage', () => {
        const component = shallow(<HomePage />);
        expect(component).toBeTruthy();
    });

    // it('Renders HomePage with data', () => {
    //     const component = mount(<HomePage {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
