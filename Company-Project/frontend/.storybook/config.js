import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withOptions } from '@storybook/addon-options';
import { withKnobs } from '@storybook/addon-knobs';
import { withSmartKnobs } from 'storybook-addon-smart-knobs'

addDecorator(
    withOptions({
        hierarchyRootSeparator: /\|/,
    })
);
addDecorator(
    withInfo({
        inline: false,
    })
);
addDecorator(
    withKnobs
);
addDecorator(
    withSmartKnobs
)


const reqComponents = require.context('../app/components', true, /\.stories\.js$/);
const reqContainers = require.context('../app/containers', true, /\.stories\.js$/);

function loadStories() {
    reqComponents.keys().forEach(filename => reqComponents(filename));
    reqContainers.keys().forEach(filename => reqContainers(filename));
}

configure(loadStories, module);
