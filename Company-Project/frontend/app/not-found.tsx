import { cache } from 'react';
import { getViewData } from '../api/wagtail';
import {
    isContainerName,
    renderContainer,
} from '../containers/renderContainer';

const getCachedViewData = cache(() => getViewData('404'));

export default async function NotFound() {
    let pageData = null;

    try {
        ({ json: pageData } = await getCachedViewData());
    } catch {
        return <h1>Page not found</h1>;
    }

    const { componentName, componentProps, redirect } = pageData;
    if (redirect || !isContainerName(componentName)) {
        return <h1>Page not found</h1>;
    }

    return renderContainer(componentName, componentProps);
}
