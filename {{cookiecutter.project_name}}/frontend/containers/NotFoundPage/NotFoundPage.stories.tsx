import React from 'react';
import type { Meta } from '@storybook/nextjs-vite';
import NotFoundPage from './NotFoundPage';
import data from './NotFoundPage.data';

export default { component: NotFoundPage } satisfies Meta<typeof NotFoundPage>;

export const NotFoundPageWithoutData = () => <NotFoundPage />;
export const NotFoundPageWithData = () => <NotFoundPage {...data} />;
