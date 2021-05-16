/* global module */

import React from 'react';
import __Pure from './__Pure';
import data from './__Pure.data';

export default {
    title: 'Components/__Pure',
    component: __Pure,
};

export const __PureWithoutData = () => <__Pure />;
export const __PureWithData = () => <__Pure {...data} />;
