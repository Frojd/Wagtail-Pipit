/* global module */

import React from 'react';
import __Container from './__Container';
import data from './__Container.data';

export default {
    title: 'Containers/__Container',
    component: __Container,
};

export const __ContainerWithoutData = () => <__Container />;
export const __ContainerWithData = () => <__Container {...data} />;
