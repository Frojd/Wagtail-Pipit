/* eslint-disable no-undef */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const config = require('./internals/config.js')();

// Output base directory
const outputPath = path.join(__dirname, config.outputPath);

// static prefix where the static files will be served on the webserver
// Eg: /static/ will be: http://localhost:7000/static/js/index.js
const staticPath = config.publicPath;

// Root app directory
const context = path.join(__dirname, config.appFolder);

module.exports = [{
    name: 'js',
    devtool: 'source-map',
    context: context,
    entry: {
        index: [
            './index.js',
        ],
    },
    output: {
        path: path.join(outputPath, config.outputPathJsFolder),
        filename: '[name].js',
        publicPath: path.posix.join(staticPath, config.outputPathJsFolder),
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ],
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'i18next': 'i18next',
    },
    stats: {
        colors: true,
        hash: false,
        modules: false
    },
    plugins: [
    ],
    resolve: {
        alias: {
            Components: path.resolve(__dirname, 'app/components/'),
            Containers: path.resolve(__dirname, 'app/containers/'),
            i18n: path.resolve(__dirname, 'app/i18n'),
            Utils: path.resolve(__dirname, 'app/utils')
        }
    },
},
{
    name: 'vendor',
    context: context,
    entry: {
        vendor: [
            'babel-polyfill',
            './vendor.js',
        ]
    },
    output: {
        path: path.join(outputPath, config.outputPathJsFolder),
        filename: 'vendor.js',
        publicPath: path.posix.join(staticPath, config.outputPathJsFolder),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'assets/**',
                to: path.posix.join(outputPath)
            }
        ]),
    ],
    stats: {
        colors: true,
        hash: false,
        modules: false
    },
},
{
    name: 'style',
    devtool: 'source-map',
    context: context,
    entry: {
        styles: [
            './scss/index.scss',
        ],
    },
    output: {
        path: path.join(outputPath, config.outputPathCssFolder),
        filename: 'index.css',
        publicPath: path.posix.join(staticPath, config.outputPathCssFolder),
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true, importLoaders: true, }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: 'inline'
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        },
                    ]
                })
            },
            {
                test: /\.*$/,
                include: /assets/,
                loader: 'file-loader?name=[path][name].[ext]',
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'index.css',
        })
    ],
    stats: {
        colors: true,
        hash: false,
        modules: false
    },
}
];
/* eslint-enable */
