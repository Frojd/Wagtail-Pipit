// Credits to https://gist.github.com/justincy/b8805ae2b333ac98d5a3bd9f431e8f70#file-next-preset-js
const path = require('path');

module.exports = {
    webpackFinal: async (baseConfig, options) => {
        const { module = {} } = baseConfig;

        const newConfig = {
            ...baseConfig,
            module: {
                ...module,
                rules: [...(module.rules || [])],
            },
        };

        // Prevent webpack from using Storybook CSS rules to process
        // CSS modules
        newConfig.module.rules.find(
            (rule) => rule.test.toString() === '/\\.css$/'
        ).exclude = /\.module\.(sa|c)ss$/;

        // Then we tell webpack what to do with CSS modules
        newConfig.module.rules.push({
            test: /\.module\.css$/,
            include: [
                path.resolve(__dirname, '../containers'),
                path.resolve(__dirname, '../components'),
            ],
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        modules: {
                            localIdentName: '[local]_[hash:base64:5]',
                            //localIdentName: '[local]',
                        },
                    },
                },
            ],
        });

        // // Prevent storybook from handling svg
        newConfig.module.rules.find(
            rule => rule.test.test('.svg')
        ).exclude = /\.svg$/;

        newConfig.module.rules.push({
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: [{loader: '@svgr/webpack', options: { ref: true }}],
        })

        newConfig.resolve.alias['/fonts'] = path.resolve(
            __dirname,
            '../public/fonts/'
        );
        newConfig.resolve.alias['/assets'] = path.resolve(
            __dirname,
            '../public/assets/'
        );
        newConfig.resolve.alias['/img'] = path.resolve(
            __dirname,
            '../public/img/'
        );

        return newConfig;
    },
};
