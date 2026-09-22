'use client';

import { useState, useEffect } from 'react';
import { getPublicViewData } from '../api/wagtail';
import LazyContainers from '../containers/LazyContainers';

export default function DynamicNotFoundPage() {
    const [data, setData] = useState(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const { json: pageData } = await getPublicViewData('404');
                setData(pageData);
            } catch {
                setHasError(true);
            }
        }
        fetchData();
    }, []);

    if (hasError) {
        return <h1>Page not found</h1>;
    }

    if (!data) {
        return null;
    }

    return <NotFoundPage {...data} />;
}

function NotFoundPage({ componentName, componentProps }) {
    const Component = LazyContainers[componentName];
    if (!Component) {
        return <h1>Component {componentName} not found</h1>;
    }
    return <Component {...componentProps} />;
}
