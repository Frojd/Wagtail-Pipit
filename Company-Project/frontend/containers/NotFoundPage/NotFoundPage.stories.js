/* global module */

import React from 'react';
import NotFoundPage from './NotFoundPage';
import data from './NotFoundPage.data';

export default {
    title: 'Containers/NotFoundPage',
    component: NotFoundPage,
};

export const NotFoundPageWithoutData = () => <NotFoundPage />;
export const NotFoundPageWithData = () => <NotFoundPage {...data} />;
