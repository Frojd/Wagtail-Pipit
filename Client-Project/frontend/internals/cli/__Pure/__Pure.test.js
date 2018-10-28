import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import __Pure from './';
// const data = __jsons['__Pure'];

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
