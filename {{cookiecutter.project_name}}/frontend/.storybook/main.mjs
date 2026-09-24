const config = {
    staticDirs: ['../public'],
    stories: [
        '../stories/**/*.stories.js',
        '../components/**/*.stories.js',
        '../containers/**/*.stories.js',
    ],
    addons: ['@storybook/addon-a11y'],
    docs: {
      defaultName: 'Documentation'
    },
    framework: {
        name: '@storybook/nextjs-vite',
        options: {},
    },
    typescript: {
        reactDocgen: 'react-docgen'
    },
    // Configure esbuild to parse .js files as JSX to support JSX syntax in JavaScript files
    async viteFinal(config) {
        config.optimizeDeps = config.optimizeDeps || {};
        config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {};
        config.optimizeDeps.esbuildOptions.loader = {
            ...config.optimizeDeps.esbuildOptions.loader,
            '.js': 'jsx',
        };
        return config;
    }
};

export default config;
