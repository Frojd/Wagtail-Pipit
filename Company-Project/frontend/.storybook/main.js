module.exports = {
    staticDirs: ['../public'],
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
        '@storybook/addon-viewport',
        '@storybook/addon-a11y',
        '@storybook/addon-backgrounds',
    ],
    features: {
        babelModeV7: true,
    },
    docs: {
        autodocs: true,
    },
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
};
