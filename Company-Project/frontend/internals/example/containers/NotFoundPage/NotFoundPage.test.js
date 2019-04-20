import React from 'react';
import {
    shallow,
    // mount
} from 'enzyme';

import NotFoundPage from './';
// const data = __jsons['NotFoundPage'];

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
