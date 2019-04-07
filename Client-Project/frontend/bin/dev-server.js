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
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(configFile.port, 'localhost', () => {
    console.log(`Dev server listening on port ${configFile.port}\nCheck loaded stuff: http://localhost:7000/webpack-dev-server`);
});
