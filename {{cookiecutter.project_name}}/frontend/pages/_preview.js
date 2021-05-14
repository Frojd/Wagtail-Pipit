import { getPagePreview, WagtailApiResponseError } from '../api/wagtail';
export { default } from './[...path]';

const isProd = process.env.NODE_ENV === 'production';

// For SSR
export async function getServerSideProps({ req, preview, previewData }) {
    if (!preview) {
        // TODO: Serve 404 component
        return { props: {} };
    }

    const { contentType, token, host } = previewData;

    // TODO: Add proper token verification and error message
    try {
        const {
            json: pagePreviewData,
        } = await getPagePreview(contentType, token, {}, {
            headers: {
                cookie: req.headers.cookie,
                host: host || req.headers.host,
            },
        });
        return {
            props: pagePreviewData,
        };
    } catch (err) {
        if (!(err instanceof WagtailApiResponseError)) {
            throw err;
        }

        if (!isProd && err.response.status >= 500) {
            const html = await err.response.text();
            return {
                props: {
                    componentName: 'PureHtmlPage',
                    componentProps: { html },
                },
            };
        }

        throw err;
    }
}

// For SSG (will disable route)
/*
export async function getStaticProps({ params, preview, previewData }) {
    return {
        props: {
            componentName: '',
            componentProps: {},
        }
    }
}
*/
