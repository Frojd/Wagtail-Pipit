/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import RawHtml from './RawHtml';

import data from './RawHtml.data';

storiesOf('Components|RawHtml', module)
    .add('without data', () => <RawHtml />)
    .add('with data', () => <RawHtml {...data} />);
