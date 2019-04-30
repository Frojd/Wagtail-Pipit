/* global process module */

const path = require('path');

const config = () => {
    const defaultRcfile = path.join(process.cwd(), '.frontendrc');
    const defaultConf = require(defaultRcfile);

    return defaultConf;
};

module.exports = config;
