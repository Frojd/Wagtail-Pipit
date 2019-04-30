/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import __Class from './__Class';

import data from './__Class.data.js';

storiesOf('Containers|__Class', module)
    .add('without data', () => <__Class />)
    .add('with data', () => <__Class {...data} />);
