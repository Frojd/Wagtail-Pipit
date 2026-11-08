/* global module */

import React from 'react';
import HomePage from './HomePage';
import data from './HomePage.data';

export default {
    component: HomePage,
};

export const HomePageWithoutData = () => <HomePage />;
export const HomePageWithData = () => <HomePage {...data} />;
