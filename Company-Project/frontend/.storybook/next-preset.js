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

        // First we prevent webpack from using Storybook CSS rules to process CSS modules
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

        // SCSS (globals)
        newConfig.module.rules.push({
            test: /\.scss$/,
            include: [
                path.resolve(__dirname, '../styles'),
                path.resolve(__dirname, '../node_modules'),
                path.resolve(__dirname, '../stories'),
            ],
            use: ['style-loader', 'css-loader'],
        });

        // Override config and drop svg
        newConfig.module.rules = newConfig.module.rules.filter((x) => {
            return (
                x.test.toString() !==
                /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/.toString()
            );
        });

        newConfig.module.rules.push({
            test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
            loaders: ['file-loader'],
            include: [
                path.resolve(__dirname, '../'),
                path.resolve(__dirname, '../public/'),
            ],
        });

        // Enable inline svg
        newConfig.module.rules.push({
            test: /\.svg$/,
            loaders: [
                '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                'url-loader',
            ],
            include: [
                path.resolve(__dirname, '../'),
                path.resolve(__dirname, '../public/'),
            ],
        });

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
