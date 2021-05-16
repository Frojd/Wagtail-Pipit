/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import HomePage from './HomePage';
import data from './HomePage.data';

export default {
    title: 'Containers/HomePage',
    component: HomePage,
};

export const HomePageWithoutData = () => <HomePage />;
export const HomePageWithData = () => <HomePage {...data} />;
