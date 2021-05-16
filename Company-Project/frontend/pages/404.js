import { useState, useEffect } from 'react';
import { getViewData, getPublicViewData } from '../api/wagtail';
import LazyContainers from '../containers/LazyContainers';

export default function DynamicNotFoundPage() {
    // 404 does not support getServerSideProps, must fetch client side data
    // https://github.com/vercel/next.js/blob/master/errors/404-get-initial-props.md
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

/*
// For static routing
export async function getStaticProps({ params, preview, previewData }) {
  const pageData = await getViewData('404');
  return { props: pageData }
}
*/
