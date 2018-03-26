/**
 * Custom webpack devserver
 */

/* eslint-disable no-undef, no-unused-vars */
const fs = require('fs');
const path = require('path')
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const Renderer = require('../internals/render/render');
const config = require('../internals/config.js')();
const renderer = new Renderer(config);
const webpackConfig = renderer.getWebpackConfig();

const server = new webpackDevServer(webpack(webpackConfig), {
    before: paths,
    headers: { 'Access-Control-Allow-Origin': '*' },
    stats: {
        colors: true,
        hash: false,
        modules: false
    },
    hot: true,
    clientLogLevel: 'warning',
    disableHostCheck: true,
    publicPath: config.publicPath,
});

function paths(app) {
    // Dev js
    app.get('/devserver.js', (req, res) => {
        const rootFolder = process.cwd();
        const rootTemplatePath = config.rootServerTemplatePath;
        const devJs = fs.readFileSync(`${path.posix.join(rootFolder, rootTemplatePath)}/devserver.js`)
        res.setHeader('Content-Type', 'text/javascript');
        res.end(devJs)
    });

    // Dev css
    app.get('/devserver.css', (req, res) => {
        const rootFolder = process.cwd();
        const rootTemplatePath = config.rootServerTemplatePath;
        const devCss = fs.readFileSync(`${path.posix.join(rootFolder, rootTemplatePath)}/devserver.css`)
        res.setHeader('Content-Type', 'text/css');
        res.end(devCss)
    });

    // Root
    app.get('/', (req, res) => {
        res.end(renderer.renderListing())
    });

    // Components
    const components = [...renderer.getComponents(), ...renderer.getContainers()];
    app.get(components.map((component) => `/${component}`), (req, res) => {
        res.end(
            renderer.renderComponent(
                req.path.replace('/', ''),
            )
        )
    });
}

console.log(`Server started on port ${config.port}`)
server.listen(config.port);
/* eslint-enable no-undef, no-unused-vars */
