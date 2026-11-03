import BasePage from './BasePage';
import React from 'react';

export const basePageWrap = (Component) => {
    const BasePageWrap = (props) => (
        <BasePage {...props} _class={Component.name}>
            <Component {...props} />
        </BasePage>
    );
    BasePageWrap.displayName = `basePageWrap(${Component.name})`;
    return BasePageWrap;
};

export default BasePage;
