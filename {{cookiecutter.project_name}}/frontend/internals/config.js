const fs = require('fs');
const path = require('path');

const config = () => {
    const defaultRcfile = path.join(process.cwd(), '.frontendrc');
    const defaultConf = eval('(' + fs.readFileSync(defaultRcfile, 'utf8') + ')');

    return defaultConf;
}

module.exports = config;
