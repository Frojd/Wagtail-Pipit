import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

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
    viewport: { options: { ...customViewports, ...INITIAL_VIEWPORTS } },
    backgrounds: {
        options: {
            white: {
                name: 'white',
                value: '#fff',
            },

            primary_pink: {
                name: 'primary pink',
                value: '#c40064',
            },

            primary_orange: {
                name: 'primary orange',
                value: '#c9472d',
            },

            dark_grey: {
                name: 'dark grey',
                value: '#333',
            }
        }
    },
};

export const tags = ['autodocs'];

export const initialGlobals = {
    backgrounds: {
        value: 'white'
    }
};
