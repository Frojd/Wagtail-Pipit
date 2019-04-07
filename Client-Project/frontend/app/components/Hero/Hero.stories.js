/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import Hero from './Hero';

import data from './Hero.json';

storiesOf('Components|Hero', module)
    .add('without data', () => <Hero />)
    .add('with data', () => <Hero {...data} />);
