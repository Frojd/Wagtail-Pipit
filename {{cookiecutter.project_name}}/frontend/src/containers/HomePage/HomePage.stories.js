import React from 'react';
import HomePage from './HomePage';

import data from './HomePage.data';

export default {
  title: 'Containers/HomePage',
};

export const WithoutData = () => <HomePage />;

WithoutData.story = {
  name: 'without data',
};

export const WithData = () => <HomePage {...data} />;

WithData.story = {
  name: 'with data',
};
