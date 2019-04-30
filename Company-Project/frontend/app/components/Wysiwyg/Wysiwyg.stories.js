/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import Wysiwyg from './Wysiwyg';

import data from './Wysiwyg.json';

storiesOf('Components|Wysiwyg', module)
    .add('without data', () => <Wysiwyg />)
    .add('with data', () => <Wysiwyg {...data} />);
