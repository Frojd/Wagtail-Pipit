/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import ArticlePage from './ArticlePage';

import data from './ArticlePage.json';

storiesOf('Containers|ArticlePage', module)
    .add('without data', () => <ArticlePage />)
    .add('with data', () => <ArticlePage {...data} />);
