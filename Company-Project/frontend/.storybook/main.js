const path = require('path');

module.exports = {
    staticDirs: ['../public'],
    stories: [
        '../stories/**/*.stories.js',
        '../components/**/*.stories.js',
        '../containers/**/*.stories.js',
    ],
    core: {
        builder: 'webpack5',
    },
    babel: async (options) => {
        options.presets = ['next/babel'];
        return {
            ...options,
        };
    },
    addons: [
        '@storybook/addon-viewport',
        '@storybook/addon-a11y',
        '@storybook/addon-backgrounds',
        {
            name: 'storybook-addon-next',
            options: {
                nextConfigPath: path.resolve(__dirname, '../next.config.js'),
            },
        },
    ],
    features: {
        babelModeV7: true,
    },
    webpackFinal: (config) => {
        /**
         * Fixes issue with `next-i18next` and is ready for webpack@5
         * @see https://github.com/isaachinman/next-i18next/issues/1012#issuecomment-792697008
         * @see https://github.com/storybookjs/storybook/issues/4082#issuecomment-758272734
         * @see https://webpack.js.org/migrate/5/
         */
        const imageRule = config.module.rules.find((rule) =>
            rule.test.test('.svg')
        );
        imageRule.exclude = /\.svg$/;

        // add your rule as normal
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        config.resolve.fallback = {
            fs: false,
            tls: false,
            net: false,
            module: false,
            path: require.resolve('path-browserify'),
            crypto: false,
        };

        return config;
    },
};
