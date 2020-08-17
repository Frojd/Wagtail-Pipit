import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import __Container from './';
// import data from './__Container.data';

describe('<__Container />', () => {
    it('Renders an empty __Container', () => {
        const component = shallow(<__Container />);
        expect(component).toBeTruthy();
    });

    // it('Renders __Container with data', () => {
    //     const component = mount(<__Container {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
