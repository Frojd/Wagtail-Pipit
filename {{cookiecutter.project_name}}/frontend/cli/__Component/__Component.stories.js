import React from 'react';
import __Component from './__Component';
import '../../i18n';
import { withA11y } from '@storybook/addon-a11y';

import data from './__Component.data.js';

export default {
  title: 'Components/__Component',
  decorators: [withA11y],
};

export const WithData = () => <__Component {...data} />;

WithData.story = {
  name: 'with data',
};

export const WithoutData = () => <__Component />;

WithoutData.story = {
  name: 'without data',
};
