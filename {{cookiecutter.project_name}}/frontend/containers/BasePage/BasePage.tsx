import React from 'react';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Script from 'next/script';

const WagtailUserbar = dynamic(() => import('../../components/WagtailUserbar'));

type OpenGraphType = Extract<
    NonNullable<Metadata['openGraph']>,
    { type: string }
>['type'];

export type Seo = {
    seoHtmlTitle: string;
    seoMetaDescription: string;
    seoOgTitle: string;
    seoOgDescription: string;
    seoOgUrl: string;
    seoOgImage?: string;
    seoOgType?: OpenGraphType;
    seoTwitterTitle: string;
    seoTwitterDescription: string;
    seoTwitterImage?: string;
    seoMetaRobots: { index: boolean; follow: boolean; value: string };
    seoCanonicalLink: string;
};

export type SiteSetting = {
    gtmId: string;
    cookieContent?: string;
};

export type WagtailUserbarData = {
    html: string;
};

export type BasePageProps = {
    seo?: Seo;
    siteSetting?: SiteSetting;
    wagtailUserbar?: WagtailUserbarData;
    children?: ReactNode;
};

const BasePage = ({ children, siteSetting, wagtailUserbar }: BasePageProps) => {
    const gtmId = siteSetting?.gtmId;
    return (
        <>
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
