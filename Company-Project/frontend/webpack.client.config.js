/* global __dirname module process */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const configFile = require('./internals/config')();

const config = {
    name: 'Client',
    devtool: 'source-map',
    context: path.join(__dirname, 'app'),
    entry: {
        index: './main.js',
    },
    mode: 'production',
    output: {
        filename: '[name].js',
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
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            importLoaders: 1,
                        }
                    },
                    'postcss-loader',
                    'sass-loader',
                ]
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
            },
            {
                test: /\.md$/,
                loader: 'ignore-loader'
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'vendor'
        }
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
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new CopyWebpackPlugin([
            {
                from: 'assets/**',
                to: path.resolve(__dirname, configFile.outputPath),
            }
        ]),
    ]
};

module.exports = config;
