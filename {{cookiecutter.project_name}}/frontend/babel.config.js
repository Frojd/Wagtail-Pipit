/* global module process */
const presets = [
    [
        '@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: process.env['CORE_JS'] ? process.env['CORE_JS'] : 3
        }
    ],
    '@babel/preset-react'
];
const plugins = [
    'react-docgen',
    'babel-plugin-webpack-alias',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
];

if(process.env['NODE_ENV'] !== 'production') {
    plugins.push('react-hot-loader/babel');
}

module.exports = {
    presets,
    plugins
};
