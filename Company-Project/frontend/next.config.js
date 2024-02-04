const { i18n } = require('./next-i18next.config');

const { withSentryConfig } = require('@sentry/nextjs');

const basePath = '';

let nextConfig = {
    trailingSlash: true,
    productionBrowserSourceMaps: true,
    basePath,
    i18n,
    output: "standalone",
};

// nextConfig = withSentryConfig(nextConfig, SentryWebpackPluginOptions);

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

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
};

const withSentry = (cnf) =>
    withSentryConfig(cnf, sentryWebpackPluginOptions, sentryOptions);

module.exports = () => {
    // Sentry must be last
    const plugins = []; // withSentry];
    return plugins.reduce((acc, plugin) => plugin(acc), {
        ...nextConfig,
    });
};
