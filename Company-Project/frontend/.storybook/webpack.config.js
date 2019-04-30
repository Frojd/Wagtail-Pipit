const config = require('../webpack.client.config');
delete(config.optimization);
module.exports = config;
