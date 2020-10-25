const path = require('path');

module.exports = {
    stories: [
        '../stories/**/*.stories.js',
        '../components/**/*.stories.js',
        '../containers/**/*.stories.js',
    ],
    babel: async (options) => {
        options.presets = ['next/babel'];
        return {
            ...options,
        };
    },
    addons: [
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-viewport',
        '@storybook/addon-a11y',
    ],
    presets: [path.resolve(__dirname, 'next-preset.js')],
    // webpackFinal: async (baseConfig) => {
    //   //const nextConfig = require('../next.config.js');
    //   // merge whatever from nextConfig into the webpack config storybook will use
    //   return { ...baseConfig };
    // },
};
