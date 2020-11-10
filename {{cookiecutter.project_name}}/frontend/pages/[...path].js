import querystring from 'querystring';
import { getPage, getViewData, getRedirect, getAllPages } from '../api/wagtail';
import LazyContainers from '../containers/LazyContainers';

const isProd = process.env.NODE_ENV === 'production';

export default function CatchAllPage({ componentName, componentProps }) {
    const Component = LazyContainers[componentName];
    if (!Component) {
        return <h1>Component {componentName} not found</h1>;
    }
    return <Component {...componentProps} />;
}

// For SSR
export async function getServerSideProps({ req, params, res }) {
    let path = params?.path || [];
    path = path.join('/');

    let queryParams = new URL(req.url, `https://${req.headers.host}`).search;
    if (queryParams.indexOf('?') === 0) {
        queryParams = queryParams.substr(1);
    }
    queryParams = querystring.parse(queryParams);

    // Try to serve page
    try {
        const { componentName, componentProps } = await getPage(
            path,
            queryParams,
            {
                headers: {
                    cookie: req.headers.cookie,
                },
            }
        );

        if (componentName === 'RedirectPage') {
            const { location, isPermanent } = componentProps;
            res.statusCode = isPermanent ? 301 : 302;
            res.setHeader('location', location);
            res.end();
        }

        return { props: { componentName, componentProps } };
    } catch (err) {
        // When in development, show django error page on error
        if (!isProd && err.response.status >= 500) {
            const html = await err.response.text();
            return {
                props: {
                    componentName: 'PureHtmlPage',
                    componentProps: { html },
                },
            };
        }

        if (err.response.status >= 500) {
            throw err;
        }
    }

    // Try to serve redirect
    try {
        const redirect = await getRedirect(path, queryParams, {
            headers: {
                cookie: req.headers.cookie,
            },
        });
        const { link, isPermanent } = redirect;
        res.statusCode = isPermanent ? 301 : 302;
        res.setHeader('location', link);
        res.end();
    } catch (err) {
        if (err.response.status >= 500) {
            throw err;
        }
    }

    // Serve 404 page
    const pageNotFoundData = await getViewData('404', queryParams, {
        headers: {
            cookie: req.headers.cookie,
        },
    });
    res.statusCode = 404;
    return { props: pageNotFoundData };
}

// For SSG
/*
export async function getStaticProps({ params, preview, previewData }) {
    params = params || {};
    let path = params.path || [];
    path = path.join("/");

    const pageData = await getPage(path);
    return { props: pageData }
}

export async function getStaticPaths() {
    const data = await getAllPages();

    let htmlUrls = data.items.map(x => x.relativeUrl);
    htmlUrls = htmlUrls.filter(x => x);
    htmlUrls = htmlUrls.map(x => x.split("/"));
    htmlUrls = htmlUrls.map(x => x.filter(y => y))
    htmlUrls = htmlUrls.filter(x => x.length)

    const paths = htmlUrls.map(x => (
        { params: { path: x } }
    ));

    return {
        paths: paths,
        fallback: false,
    };
}
*/
