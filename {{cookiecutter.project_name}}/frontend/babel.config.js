const presets = [
    [
        '@babel/preset-env', {
            useBuiltIns: 'usage'
        }
    ],
    '@babel/preset-react'
];
const plugins = [
    'react-hot-loader/babel',
    'babel-plugin-webpack-aliases',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
]
module.exports = {
    presets,
    plugins
};
