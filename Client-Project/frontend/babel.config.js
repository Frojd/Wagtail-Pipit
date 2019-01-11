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

if(process.env['BABEL_ENV'] === 'ssr') {
    // Needed to remove imports of css modules in js files
    plugins.push(['react-css-modules', {
        'removeImport': true,
        'filetypes': {
            '.scss': {
                'syntax': 'postcss-scss'
            }
        }
    }])
}

module.exports = {
    presets,
    plugins
};
