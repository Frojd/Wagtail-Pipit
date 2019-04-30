/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import NotFoundPage from './NotFoundPage';

import data from './NotFoundPage.json';

storiesOf('Containers|NotFoundPage', module)
    .add('without data', () => <NotFoundPage />)
    .add('with data', () => <NotFoundPage {...data} />);
