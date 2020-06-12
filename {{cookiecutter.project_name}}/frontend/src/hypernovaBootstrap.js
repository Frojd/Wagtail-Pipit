// require('ignore-styles');

// create-react-app requirement
process.env.NODE_ENV = 'production';

require('@babel/register')({
    ignore: [ /(node_modules)/],
    presets: ["@babel/preset-env", 'react-app'],
});

require.extensions['.scss'] = () => {};
require.extensions['.css'] = () => {};
require('./hypernova');
