import React from 'react';
import type { Meta } from '@storybook/nextjs-vite';
import HomePage from './HomePage';
import data from './HomePage.data';

export default { component: HomePage } satisfies Meta<typeof HomePage>;

export const HomePageWithoutData = () => <HomePage />;
export const HomePageWithData = () => <HomePage {...data} />;
