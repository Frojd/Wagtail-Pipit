import React from 'react';
import type { Meta } from '@storybook/nextjs-vite';
import Hero from './Hero';
import data from './Hero.data';

export default { component: Hero } satisfies Meta<typeof Hero>;

export const HeroWithoutData = () => <Hero />;
export const HeroWithData = () => <Hero {...data} />;
