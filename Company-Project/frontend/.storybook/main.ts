import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
    staticDirs: ['../public'],
    stories: [
        '../stories/**/*.stories.tsx',
        {
            directory: '../components',
            files: '**/*.stories.tsx',
            titlePrefix: 'Components',
        },
        {
            directory: '../containers',
            files: '**/*.stories.tsx',
            titlePrefix: 'Containers',
        },
    ],
    addons: ['@storybook/addon-a11y'],
    docs: {
        defaultName: 'Documentation',
    },
    framework: {
        name: '@storybook/nextjs-vite',
        options: {},
    },
    typescript: {
        reactDocgen: 'react-docgen',
    },
};

export default config;
