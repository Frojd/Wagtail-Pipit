import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import getConfig from 'next/config';
import '../index.css';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const config = getConfig();
    const distDir = `${config.serverRuntimeConfig.rootDir}/.next`;
    Sentry.init({
        enabled: process.env.NODE_ENV === 'production',
        integrations: [
            new RewriteFrames({
                iteratee: (frame) => {
                    frame.filename = frame.filename.replace(
                        distDir,
                        'app:///_next'
                    );
                    return frame;
                },
            }),
        ],
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
}

function MyApp({ Component, pageProps, err }) {
    return <Component {...pageProps} err={err} />;
}

export default MyApp;
