/* global __dirname */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const configFile = require('./internals/config')();

const config = {
    devtool: 'source-map',
    context: path.join(__dirname, 'app'),
    entry: {
        vendor: './vendor.js',
        main: './main.js',
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
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            importLoaders: 1,
                        }
                    },
                    'postcss-loader'
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
        ]
    },
    stats: {
        colors: true,
        hash: false,
        modules: false
    },
    resolve: {
        alias: {
            Components: path.resolve(__dirname, 'app/components/'),
            i18n: path.resolve(__dirname, 'app/i18n'),
        }
    },
    externals: {
        React: 'react',
        ReactDOM: 'react-dom',
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
