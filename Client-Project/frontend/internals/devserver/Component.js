/* global module */

import { hot } from 'react-hot-loader/root';
import { importAllJsons } from '../utils';

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

const Component = hot(component);
const jsonsContext = require.context('../../app', true, /\.json$/);
const jsons = importAllJsons(jsonsContext);
const props = jsons[queryJson];

export { Component, props };
