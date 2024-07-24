import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const WagtailUserbar = dynamic(() => import('../../components/WagtailUserbar'));

const BasePage = ({ children, seo, shouldRenderSeo, wagtailUserbar }) => {
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
        canonicalLink,
    } = seo;
    return (
        <>
            {shouldRenderSeo && (
                <Head>
                    <title>{seoHtmlTitle}</title>
                    <link rel="icon" href="/favicon.ico" />
                    {!!seoMetaDescription && (
                        <meta name="description" content={seoMetaDescription} />
                    )}
                    {!!seoOgTitle && (
                        <meta property="og:title" content={seoOgTitle} />
                    )}
                    {!!seoOgDescription && (
                        <meta
                            property="og:description"
                            content={seoOgDescription}
                        />
                    )}
                    {!!seoOgUrl && (
                        <meta property="og:url" content={seoOgUrl} />
                    )}
                    {!!seoOgImage && (
                        <meta property="og:image" content={seoOgImage} />
                    )}
                    {!!seoOgType && (
                        <meta property="og:type" content={seoOgType} />
                    )}
                    {!!seoTwitterTitle && (
                        <meta
                            property="twitter:title"
                            content={seoTwitterTitle}
                        />
                    )}
                    {!!seoTwitterDescription && (
                        <meta
                            property="twitter:description"
                            content={seoTwitterDescription}
                        />
                    )}
                    {!!seoTwitterUrl && (
                        <meta property="twitter:url" content={seoTwitterUrl} />
                    )}
                    {!!seoTwitterImage && (
                        <meta
                            property="twitter:image"
                            content={seoTwitterImage}
                        />
                    )}
                    {!!seoMetaRobots && (
                        <meta name="robots" content={seoMetaRobots.value} />
                    )}
                    {!!canonicalLink && (
                        <link rel="canonical" href={canonicalLink} />
                    )}
                </Head>
            )}
            <div className="BasePage">{children}</div>
            {!!wagtailUserbar && <WagtailUserbar {...wagtailUserbar} />}
        </>
    );
};

BasePage.defaultProps = {
    seo: {},
    shouldRenderSeo: true,
};

BasePage.propTypes = {
    children: PropTypes.node,
    seo: PropTypes.shape({
        seoHtmlTitle: PropTypes.string,
        seoMetaDescription: PropTypes.string,
        seoOgTitle: PropTypes.string,
        seoOgDescription: PropTypes.string,
        seoOgUrl: PropTypes.string,
        seoTwitterTitle: PropTypes.string,
        seoMetaRobots: PropTypes.shape({
            index: PropTypes.bool,
            follow: PropTypes.bool,
            value: PropTypes.string,
        }),
    }),
    shouldRenderSeo: PropTypes.bool,
    wagtailUserbar: PropTypes.shape({
        html: PropTypes.string,
    }),
};

export default BasePage;
