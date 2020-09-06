import React from 'react';
import __Container from './__Container';
import '../../i18n';
import { withA11y } from '@storybook/addon-a11y';

import data from './__Container.data.js';

export default {
  title: 'Containers/__Container',
  decorators: [withA11y],
};

export const WithData = () => <__Container {...data} />;

WithData.story = {
  name: 'with data',
};

export const WithoutData = () => <__Container />;

WithoutData.story = {
  name: 'without data',
};
