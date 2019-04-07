/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import __Class from './__Class';

import data from './__Class.json';

storiesOf('Containers|__Class', module)
    .add('without data', () => <__Class />)
    .add('with data', () => <__Class {...data} />);
