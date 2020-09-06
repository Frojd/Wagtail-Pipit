import React from 'react';
import RawHtml from './RawHtml';

import data from './RawHtml.data';

export default {
  title: 'Components/RawHtml',
};

export const WithoutData = () => <RawHtml />;

WithoutData.story = {
  name: 'without data',
};

export const WithData = () => <RawHtml {...data} />;

WithData.story = {
  name: 'with data',
};
