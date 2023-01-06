/* global module */

import React from 'react';
import __Component from './__Component';
import data from './__Component.data';

const __ComponentStory = {
    title: 'Components/__Component',
    component: __Component,
};
export default __ComponentStory;

export const __ComponentWithData = () => <__Component {...data} />;
export const __ComponentWithoutData = () => <__Component />;
