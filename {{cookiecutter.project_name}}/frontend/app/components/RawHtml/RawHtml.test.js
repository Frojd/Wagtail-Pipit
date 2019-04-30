import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import RawHtml from './';
// import data from './RawHtml.data';

describe('<RawHtml />', () => {
    it('Renders an empty RawHtml', () => {
        const component = shallow(<RawHtml />);
        expect(component).toBeTruthy();
    });

    // it('Renders RawHtml with data', () => {
    //     const component = mount(<RawHtml {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
