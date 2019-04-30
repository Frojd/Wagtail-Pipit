import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import __Class from './';
// const data = __jsons['__Class'];

describe('<__Class />', () => {
    it('Renders an empty __Class', () => {
        const component = shallow(<__Class />);
        expect(component).toBeTruthy();
    });

    // it('Renders __Class with data', () => {
    //     const component = mount(<__Class {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
