/* global module */

import React from 'react';
import RawHtml from './RawHtml';

import data from './RawHtml.data';

export default {
    component: RawHtml,
};

export const RawHtmlWithoutData = () => <RawHtml />;
export const RawHtmlWithData = () => <RawHtml {...data} />;
