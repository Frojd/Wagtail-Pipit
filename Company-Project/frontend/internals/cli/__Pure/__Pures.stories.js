/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import __Pure from './__Pure';

import data from './__Pure.data.js';

storiesOf('Components|__Pure', module)
    .add('without data', () => <__Pure />)
    .add('with data', () => <__Pure {...data} />);
