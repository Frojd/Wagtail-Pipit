import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import NotFoundPage from './';
// import data from './NotFoundPage.data';

describe('<NotFoundPage />', () => {
    it('Renders an empty NotFoundPage', () => {
        const component = shallow(<NotFoundPage />);
        expect(component).toBeTruthy();
    });

    // it('Renders NotFoundPage with data', () => {
    //     const component = mount(<NotFoundPage {...data} />);
    //     expect(component).toMatchSnapshot();
    // });
});
