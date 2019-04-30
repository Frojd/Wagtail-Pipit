/* global */

import { hot } from 'react-hot-loader/root';

const url = new URL(document.location);
const params = url.searchParams;
const pathComponent = url.pathname.split('/')[1];
const queryComponent = pathComponent || params.get('__component');
const queryJson = params.get('__json') || queryComponent;

let component = false;
try {
    component = require(`../../app/components/${queryComponent}`).default;
} catch (e) {
    try {
        component = require(`../../app/containers/${queryComponent}`).default;
    } catch (e) {
        component = require('./ListComponents.js').default;
    }
}

let props = {};
try {
    props = require(`../../app/components/${queryJson}/${queryJson}.data`)
        .default;
} catch (e) {
    try {
        props = require(`../../app/containers/${queryJson}/${queryJson}.data`)
            .default;
    } catch (e) {
        console.log(e);
    }
}

const Component = hot(component);

export { Component, props };
