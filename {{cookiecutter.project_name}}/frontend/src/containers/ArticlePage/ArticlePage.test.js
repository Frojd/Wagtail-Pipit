import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import ArticlePage from './';
// import data from './ArticlePage.data';

describe('<ArticlePage />', () => {
    it('Renders an empty ArticlePage', () => {
        const component = shallow(<ArticlePage />);
        expect(component).toBeTruthy();
    });

    // it('Renders ArticlePage with data', () => {
    //     const component = mount(<ArticlePage {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
