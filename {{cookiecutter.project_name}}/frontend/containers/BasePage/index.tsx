import BasePage from './BasePage';
import type { BasePageProps } from './BasePage';
import React from 'react';
import type { ComponentType } from 'react';

export type {
    BasePageProps,
    Seo,
    SiteSetting,
    WagtailUserbarData,
} from './BasePage';

export const basePageWrap = <P extends object>(Component: ComponentType<P>) => {
    const BasePageWrap = (props: P & BasePageProps) => (
        <BasePage {...props}>
            <Component {...props} />
        </BasePage>
    );
    BasePageWrap.displayName = `basePageWrap(${Component.name})`;
    return BasePageWrap;
};

export default BasePage;
