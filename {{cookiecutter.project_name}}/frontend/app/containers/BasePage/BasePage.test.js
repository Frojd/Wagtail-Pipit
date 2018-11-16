import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import BasePage from './';
// const data = __jsons['BasePage'];

describe('<BasePage />', () => {
    it('Renders an empty BasePage', () => {
        const component = shallow(<BasePage />);
        expect(component).toBeTruthy();
    });

    // it('Renders BasePage with data', () => {
    //     const component = mount(<BasePage {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
