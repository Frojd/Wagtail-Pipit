/* global module */

import React from 'react';
import Hero from './Hero';
import data from './Hero.data';

export default {
    component: Hero,
};

export const HeroWithoutData = () => <Hero />;
export const HeroWithData = () => <Hero {...data} />;
