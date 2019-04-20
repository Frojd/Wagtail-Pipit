/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import HomePage from './HomePage';

import data from './HomePage.json';

storiesOf('Containers|HomePage', module)
    .add('without data', () => <HomePage />)
    .add('with data', () => <HomePage {...data} />);
