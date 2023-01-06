const { i18n } = require('./next-i18next.config');

const { withSentryConfig } = require('@sentry/nextjs');

const basePath = '';

let nextConfig = {
    trailingSlash: true,
    productionBrowserSourceMaps: true,
    basePath,
    i18n,
};

const withSvgr = (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
        webpack(config) {
            config.module.rules.push({
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            });
            return config;
        },
    });
};

const SentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true,
    dryRun: process.env.IGNORE_SENTRY ? true : false,
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// nextConfig = withSentryConfig(nextConfig, SentryWebpackPluginOptions);

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// });

module.exports = () => {
    const plugins = [withSvgr];
    return plugins.reduce((acc, plugin) => plugin(acc), {
        ...nextConfig,
    });
};
