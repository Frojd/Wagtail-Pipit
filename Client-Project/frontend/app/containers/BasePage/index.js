import BasePage from './BasePage';
import React from 'react';

export const basePageWrap = (Component) => (props) => {
    return (
        <BasePage {...props} _class={Component.name}>
            <Component {...props} />
        </BasePage>
    );
};

export default BasePage;
