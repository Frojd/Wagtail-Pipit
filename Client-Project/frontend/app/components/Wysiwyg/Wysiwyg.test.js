import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import Wysiwyg from './';
// const data = __jsons['Wysiwyg'];

describe('<Wysiwyg />', () => {
    it('Renders an empty Wysiwyg', () => {
        const component = shallow(<Wysiwyg />);
        expect(component).toBeTruthy();
    });

    // it('Renders Wysiwyg with data', () => {
    //     const component = mount(<Wysiwyg {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
