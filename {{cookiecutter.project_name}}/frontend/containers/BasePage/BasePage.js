import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const WagtailUserbar = dynamic(() => import('../../components/WagtailUserbar'));

const BasePage = ({
    children,
    seo = {},
    shouldRenderSeo = true,
    siteSetting,
    wagtailUserbar,
}) => {
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
    const gtmId = siteSetting?.gtmId;
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
            {!!gtmId && (
                <>
                    <Script id="gtm" strategy="afterInteractive">
                        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','${gtmId}');`}
                    </Script>
                    <noscript
                        dangerouslySetInnerHTML={{
                            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                        }}
                    />
                </>
            )}
        </>
    );
};

export default BasePage;
