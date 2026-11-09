import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';

const basePath = '';

const nextConfig: NextConfig = {
    trailingSlash: true,
    basePath,
    output: 'standalone',
    allowedDevOrigins: ['{{ cookiecutter.domain_prod }}.test'],
    // next build resolves typescript to the TypeScript 6 alias, npm run typecheck runs TypeScript 7
    typescript: { ignoreBuildErrors: true },
};

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// });

const sentryWebpackPluginOptions = {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    dryRun: process.env.IGNORE_SENTRY ? true : false,

    org: 'your-sentry-organization',
    project: 'your-sentry-project',
};

const sentryOptions = {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    webpack: {
        treeshake: {
            // Automatically tree-shake Sentry logger statements to reduce bundle size
            removeDebugLogging: true,
        },
    },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- add withSentry to plugins below to enable Sentry
const withSentry = (cnf: NextConfig): NextConfig =>
    withSentryConfig(cnf, { ...sentryWebpackPluginOptions, ...sentryOptions });

const config = () => {
    // Sentry must be last
    const plugins: ((config: NextConfig) => NextConfig)[] = []; // withSentry];
    return plugins.reduce((acc, plugin) => plugin(acc), {
        ...nextConfig,
    });
};

export default config;
