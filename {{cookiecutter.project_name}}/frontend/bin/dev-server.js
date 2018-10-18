const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('../webpack.config.js');
config.devtool = 'eval';
config.mode = 'development';
config.entry.main = '../internals/devserver/Components.js';
config.output['pathinfo'] = false,
delete(config.entry.vendor)
config.plugins.push(new webpack.HotModuleReplacementPlugin())
config.module.rules[1].use[0] = 'style-loader';
const options = {
    contentBase: './internals/devserver',
    publicPath: '/static/',
    hot: true,
    host: 'localhost',
    historyApiFallback: true,
    stats: {
        colors: true,
        hash: false,
        modules: false
    },
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(7000, 'localhost', () => {
    console.log('Dev server listening on port 7000\nCheck loaded stuff: http://localhost:7000/webpack-dev-server');
});
