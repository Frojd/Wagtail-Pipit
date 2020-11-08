import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import __Pure from './';
// import data from './__Pure.data';

describe('<__Pure />', () => {
    it('Renders an empty __Pure', () => {
        const component = shallow(<__Pure />);
        expect(component).toBeTruthy();
    });

    // it('Renders __Pure with data', () => {
    //     const component = mount(<__Pure {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
