import { cache } from 'react';
import { getViewData } from '../api/wagtail';
import LazyContainers from '../containers/LazyContainers';

const getCachedViewData = cache(() => getViewData('404'));

export default async function NotFound() {
    let pageData = null;

    try {
        ({ json: pageData } = await getCachedViewData());
    } catch {
        return <h1>Page not found</h1>;
    }

    const { componentName, componentProps } = pageData;
    const Component = LazyContainers[componentName];

    if (!Component) {
        return <h1>Page not found</h1>;
    }

    return <Component {...componentProps} />;
}
