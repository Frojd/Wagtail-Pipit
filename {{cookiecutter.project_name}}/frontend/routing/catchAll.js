import { cache } from 'react';
import { headers, draftMode } from 'next/headers';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import LazyContainers from '../containers/LazyContainers';

import {
    getPage,
    getPagePreview,
    getRedirect,
    WagtailApiResponseError,
} from '../api/wagtail';

const isProd = process.env.NODE_ENV === 'production';

async function getPreviewPageData({
    contentType,
    token,
    inPreviewPanel,
    headers = {},
}) {
    try {
        const { json: pagePreviewData } = await getPagePreview(
            contentType,
            token,
            {
                in_preview_panel: inPreviewPanel,
            },
            {
                headers,
            }
        );
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

async function getPageData({
    path,
    searchParams,
    headers = {},
    options = null,
}) {
    // Try to serve page
    try {
        const {
            json: { componentName, componentProps, redirect },
        } = await getPage(path, searchParams, {
            headers,
            cache: options?.cache,
            revalidate: options?.revalidate,
        });

        if (redirect) {
            const { destination, isPermanent } = redirect;
            return {
                redirect: {
                    destination: destination,
                    permanent: isPermanent,
                },
            };
        }

        return {
            props: { componentName, componentProps },
        };
    } catch (err) {
        if (!(err instanceof WagtailApiResponseError)) {
            throw err;
        }

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
        const { json: redirect } = await getRedirect(path, searchParams, {
            headers,
        });

        const { destination, isPermanent } = redirect;
        return {
            redirect: {
                destination: destination,
                permanent: isPermanent,
            },
        };
    } catch (err) {
        if (!(err instanceof WagtailApiResponseError)) {
            throw err;
        }

        if (err.response.status >= 500) {
            throw err;
        }
    }

    return { notFound: true };
}

const getCachedPageData = cache(async (path, searchParamsJson, cookie) =>
    getPageData({
        path,
        searchParams: JSON.parse(searchParamsJson),
        headers: { cookie },
    })
);

// Both entry points below must build identical arguments or nothing dedupes
async function loadPageData({ params, searchParams }) {
    const headersList = await headers();
    const { path } = (await params) ?? {};
    const query = (await searchParams) ?? {};

    return await getCachedPageData(
        Array.isArray(path) ? path.join('/') : (path ?? ''),
        JSON.stringify({ ...query, host: headersList.get('host') }),
        headersList.get('cookie')
    );
}

const getCachedPreviewPageData = cache(
    async (contentType, token, inPreviewPanel, cookie) =>
        getPreviewPageData({
            contentType,
            token,
            inPreviewPanel,
            headers: { cookie },
        })
);

async function loadRouteData(props) {
    const { isEnabled: isDraftEnabled } = await draftMode();
    const query = (await props.searchParams) ?? {};

    if (isDraftEnabled && query.contentType && query.token) {
        const headersList = await headers();
        return await getCachedPreviewPageData(
            query.contentType,
            query.token,
            query.inPreviewPanel === 'true',
            headersList.get('cookie')
        );
    }

    return await loadPageData(props);
}

export async function generateMetadata(props) {
    const data = await loadRouteData(props);

    if (data?.redirect) {
        return {};
    }

    if (data?.notFound) {
        return {};
    }

    const { seo } = data.props.componentProps;

    if (!seo) {
        return {};
    }

    const {
        seoHtmlTitle,
        seoMetaDescription,
        seoOgTitle,
        seoOgDescription,
        seoOgUrl,
        seoOgImage,
        seoOgType,
        seoTwitterTitle,
        seoTwitterDescription,
        seoTwitterUrl,
        seoTwitterImage,
        seoMetaRobots,
        seoCanonicalLink,
    } = seo;

    return {
        ...(seoOgUrl && { metadataBase: new URL(seoOgUrl) }),
        title: seoHtmlTitle,
        description: seoMetaDescription,
        openGraph: {
            title: seoOgTitle,
            description: seoOgDescription,
            images: seoOgImage,
            url: seoOgUrl,
            type: seoOgType || 'website',
        },
        twitter: {
            title: seoTwitterTitle,
            description: seoTwitterDescription,
            images: [seoTwitterImage],
        },
        alternates: {
            canonical: seoCanonicalLink,
        },
        ...(seoMetaRobots && {
            robots: {
                index: seoMetaRobots.index,
                follow: seoMetaRobots.follow,
            },
        }),
    };
}

export default async function CatchAllPage(props) {
    const data = await loadRouteData(props);

    if (data?.redirect) {
        const { destination, permanent } = data.redirect;
        return permanent
            ? permanentRedirect(destination)
            : redirect(destination);
    }

    if (data.notFound) {
        return notFound();
    }

    const { componentName, componentProps } = data.props || {};

    const Component = LazyContainers[componentName];
    if (!Component) {
        return <h1>Component {componentName} not found</h1>;
    }
    return <Component {...componentProps} />;
}
