/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import __Container from './__Container';
import '../../i18n';
import { withA11y } from'@storybook/addon-a11y';

import data from './__Container.data.js';

storiesOf('Containers|__Container', module)
    .addDecorator(withA11y)
    .add('with data', () => <__Container {...data} />)
    .add('without data', () => <__Container />);
