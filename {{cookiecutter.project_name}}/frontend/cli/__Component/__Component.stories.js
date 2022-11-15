/* global module */

import React from 'react';
import __Component from './__Component';
import data from './__Component.data';

export default {
    title: 'Components/__Component',
    component: __Component,
};

export const __ComponentWithoutData = () => <__Component />;
export const __ComponentWithData = () => <__Component {...data} />;
