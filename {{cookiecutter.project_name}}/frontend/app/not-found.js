'use client';

import { useState, useEffect } from 'react';
import { getViewData, getPublicViewData } from '../api/wagtail';
import LazyContainers from '../containers/LazyContainers';

export default function DynamicNotFoundPage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            const { json: pageData } = await getPublicViewData('404');
            setData(pageData);
        }
        fetchData();
    }, []);

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
