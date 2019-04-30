/* global __dirname module */

const path = require('path');

const configFile = require('./internals/config')();

const config = {
    name: 'SSR',
    target: 'node',
    devtool: 'none',
    context: path.join(__dirname, 'app'),
    entry: {
        App: './containers/App/index.js'
    },
    mode: 'production',
    output: {
        filename: 'App.js',
        library: 'App',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, configFile.outputPath),
        publicPath: configFile.publicPath,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ]
            },
            {
                test: /\.(md|css|scss)*$/,
                loader: 'ignore-loader'
            },
            {
                test: /\.*$/,
                include: /assets/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                ]
            }
        ]
    },
    stats: {
        colors: true,
        hash: false,
        modules: false,
        children: false,
    },
    resolve: {
        alias: {
            Containers: path.resolve(__dirname, 'app/containers/'),
            Components: path.resolve(__dirname, 'app/components/'),
            i18n: path.resolve(__dirname, 'app/i18n'),
            Styles: path.resolve(__dirname, 'app/styles'),
            Utils: path.resolve(__dirname, 'app/utils'),
            'react-dom': '@hot-loader/react-dom'
        }
    }
};

module.exports = config;
