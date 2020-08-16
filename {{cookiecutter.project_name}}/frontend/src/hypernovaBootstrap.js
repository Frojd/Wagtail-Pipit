// require('ignore-styles');

// create-react-app requirement
process.env.NODE_ENV = 'production';

// On node 12 babel only transpiles code if BABEL_ENV is set to 'test'
// https://github.com/babel/babel/issues/9920#issuecomment-487537396
process.env.BABEL_ENV = 'test';

require('@babel/register')({
    ignore: [ /(node_modules)/],
    presets: ["@babel/preset-env", 'react-app'],
});

require.extensions['.scss'] = () => {};
require.extensions['.css'] = () => {};
require('./hypernova');
