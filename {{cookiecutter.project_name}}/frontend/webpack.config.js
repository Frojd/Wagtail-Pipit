/* global module */

const clientConfig = require('./webpack.client.config');
const ssrConfig = require('./webpack.ssr.config');

module.exports = [clientConfig, ssrConfig];
