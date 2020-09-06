import React from 'react';
import Hero from './Hero';

import data from './Hero.data';

export default {
  title: 'Components/Hero',
};

export const WithoutData = () => <Hero />;

WithoutData.story = {
  name: 'without data',
};

export const WithData = () => <Hero {...data} />;

WithData.story = {
  name: 'with data',
};
