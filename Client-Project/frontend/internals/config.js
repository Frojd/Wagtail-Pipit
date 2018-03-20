/**
 * The configuration
 */

/* global __dirname */

const fs = require('fs');
const path = require('path');

const config = (overrides = {}) => {
    const defaultRcfile = path.join(__dirname, '.frontendrc');
    let defaultConf = eval('(' + fs.readFileSync(defaultRcfile, 'utf8') + ')');

    const localRcfile = path.join(process.cwd(), '.frontendrc');
    if(fs.existsSync(localRcfile)) {
        const localConf = eval('(' + fs.readFileSync(localRcfile, 'utf8') + ')');
        Object.assign(defaultConf, localConf);
    }

    Object.assign(defaultConf, overrides);

    if(defaultConf.createPure && defaultConf.createClass) {
        throw new Error('createPure and createClass can not be true at the same time');
    }

    return defaultConf;
}

module.exports = config;
