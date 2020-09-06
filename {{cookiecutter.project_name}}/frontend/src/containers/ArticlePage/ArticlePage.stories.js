import React from 'react';
import ArticlePage from './ArticlePage';

import data from './ArticlePage.data';

export default {
  title: 'Containers/ArticlePage',
};

export const WithoutData = () => <ArticlePage />;

WithoutData.story = {
  name: 'without data',
};

export const WithData = () => <ArticlePage {...data} />;

WithData.story = {
  name: 'with data',
};
