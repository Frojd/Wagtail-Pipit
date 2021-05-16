/* global module */

import React from 'react';
import __Class from './__Class';
import data from './__Class.data';

export default {
    title: 'Components/__Class',
    component: __Class,
};

export const __ClassWithoutData = () => <__Class />;
export const __ClassWithData = () => <__Class {...data} />;
