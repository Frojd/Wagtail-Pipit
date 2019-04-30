const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const configFile = require('../internals/config')();
const config = require('../webpack.client.config.js');
config.devtool = 'eval';
config.mode = 'development';
config.entry.index = '../internals/devserver/RenderComponent.js';
config.output['pathinfo'] = false,
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.module.rules[1].use[0] = 'style-loader';
config.module.rules.push({ test: /\.md$/, loader: 'ignore-loader' });
delete(config.optimization);

const port = process.argv.indexOf('--port') !== -1 && process.argv[process.argv.indexOf('--port') + 1] || configFile.port

const proxy = {};
if(process.argv.indexOf('--proxy') !== -1) {
    const proxyHost = process.argv[process.argv.indexOf('--proxy') + 1];
    if(!proxyHost) {
        throw new Error('Missing proxy host after proxy argument');
    }
    config.entry.index = '../internals/devserver/ProxyComponent.js';
    proxy['context'] = () => true;
    proxy['target'] = proxyHost;
    proxy['secure'] = false;
}

const options = {
    contentBase: './internals/devserver',
    publicPath: configFile.publicPath,
    hot: true,
    host: 'localhost',
    historyApiFallback: true,
    stats: {
        colors: true,
        hash: false,
        modules: false,
        children: false,
    },
    proxy: proxy,
    // Yes this is a securityissue, however you should never run this webserver in production either.
    disableHostCheck: true,
    headers: {
        'x-disable-ssr': true
    }
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(port, 'localhost', () => {
    console.log(`Dev server listening on port ${port}\nCheck loaded stuff: http://localhost:${port}/webpack-dev-server`);
});
