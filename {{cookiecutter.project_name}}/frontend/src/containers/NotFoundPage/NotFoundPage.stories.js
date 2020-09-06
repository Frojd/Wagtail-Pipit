import React from 'react';
import NotFoundPage from './NotFoundPage';

import data from './NotFoundPage.data';

export default {
  title: 'Containers/NotFoundPage',
};

export const WithoutData = () => <NotFoundPage />;

WithoutData.story = {
  name: 'without data',
};

export const WithData = () => <NotFoundPage {...data} />;

WithData.story = {
  name: 'with data',
};
