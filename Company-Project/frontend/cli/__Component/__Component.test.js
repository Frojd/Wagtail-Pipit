import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import __Component from './';
// import data from './__Component.data';

describe('<__Component />', () => {
    it('Renders an empty __Component', () => {
        const component = shallow(<__Component />);
        expect(component).toBeTruthy();
    });

    // it('Renders __Component with data', () => {
    //     const component = mount(<__Component {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
