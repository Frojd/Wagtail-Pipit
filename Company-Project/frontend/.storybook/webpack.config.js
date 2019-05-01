const custom = require('../webpack.client.config.js');

module.exports = async ({ config, mode }) => {
    const customConfig = {
        ...config,
        module: {
            ...config.module,
            rules: custom.module.rules,
        },
        resolve: {
            alias: {
                ...config.resolve.alias,
                ...custom.resolve.alias
            }
        }
    };
    customConfig.module.rules[1].use[0] = 'style-loader';
    return customConfig;
};
