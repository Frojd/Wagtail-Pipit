import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
    static async getInitialProps(ctx) {
        let pageProps = null;

        const originalRenderPage = ctx.renderPage;
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => {
                    pageProps = props.pageProps;
                    return <App {...props} />;
                },
                enhanceComponent: (Component) => Component,
            });

        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps, pageProps };
    }

    static defaultProps = {
        pageProps: {
            componentProps: {
                siteSetting: {},
            },
        },
    };

    render() {
        const { pageProps } = this.props;
        const gtmId = pageProps?.componentProps?.siteSetting?.gtmId;

        return (
            <Html>
                <Head />
                <body>
                    {!!gtmId && (
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                                    })(window,document,'script','dataLayer','${gtmId}');`,
                            }}
                        />
                    )}

                    {!!gtmId && (
                        <noscript
                            dangerouslySetInnerHTML={{
                                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                            }}
                        />
                    )}
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default CustomDocument;
