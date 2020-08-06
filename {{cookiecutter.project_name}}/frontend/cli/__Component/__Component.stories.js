/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import __Component from './__Component';
import '../../i18n';
import { withA11y } from'@storybook/addon-a11y';

import data from './__Component.data.js';

storiesOf('Components|__Component', module)
    .addDecorator(withA11y)
    .add('with data', () => <__Component {...data} />)
    .add('without data', () => <__Component />);
