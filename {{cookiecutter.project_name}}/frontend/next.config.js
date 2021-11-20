const withPlugins = require('next-compose-plugins');

const { withSentryConfig } = require("@sentry/nextjs");

const basePath = ''

let nextConfig = {
    future: {
        webpack5: true,
    },
    trailingSlash: true,
    productionBrowserSourceMaps: true,
    basePath,
}

const withSvgr = (nextConfig = {}, nextComposePlugins = {}) => {
    return Object.assign({}, nextConfig, {
        webpack(config, options) {
            config.module.rules.push({
                test: /\.svg$/,
                use: [
                    '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                ],
            });

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options);
            }

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

nextConfig = withSentryConfig(nextConfig, SentryWebpackPluginOptions);

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// });

module.exports = withPlugins([
    withSvgr,
    //withBundleAnalyzer,
], nextConfig);
