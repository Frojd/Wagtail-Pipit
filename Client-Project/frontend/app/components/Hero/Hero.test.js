import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import Hero from './';
// const data = __jsons['Hero'];

describe('<Hero />', () => {
    it('Renders an empty Hero', () => {
        const component = shallow(<Hero />);
        expect(component).toBeTruthy();
    });

    // it('Renders Hero with data', () => {
    //     const component = mount(<Hero {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
