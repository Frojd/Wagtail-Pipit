/* global module */

import React from 'react';
import __Container from './__Container';
import data from './__Container.data';

const __ContainerStory = {
    title: 'Containers/__Container',
    component: __Container,
};
export default __ContainerStory;

export const __ContainerWithData = () => <__Container {...data} />;
export const __ContainerWithoutData = () => <__Container />;
