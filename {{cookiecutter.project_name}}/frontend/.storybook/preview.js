import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import * as NextImage from 'next/image';

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
    configurable: true,
    value: (props) => <OriginalNextImage {...props} unoptimized />,
});

import '../styles/index.css';

export const decorators = [
    (storyFn) => <I18nextProvider i18n={i18n}>{storyFn()}</I18nextProvider>,
];

const customViewports = {
    gridSL: {
        name: 'GRID - SL - Fluid',
        styles: {
            width: '500px',
            height: '950px',
        },
    },
    gridS: {
        name: 'GRID - S - Fluid',
        styles: {
            width: '375px',
            height: '950px',
        },
    },
};

export const parameters = {
    layout: 'fullscreen',
    viewport: { viewports: { ...customViewports, ...INITIAL_VIEWPORTS } },
    backgrounds: {
        default: 'white',
        values: [
            {
                name: 'white',
                value: '#fff',
            },
            {
                name: 'primary pink',
                value: '#c40064',
            },
            {
                name: 'primary orange',
                value: '#c9472d',
            },
            {
                name: 'dark grey',
                value: '#333',
            },
        ],
    },
};
