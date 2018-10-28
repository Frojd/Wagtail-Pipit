import NotFoundPage from './containers/NotFoundPage';
import BasePage from './containers/BasePage';
import ArticlePage from './containers/ArticlePage';
import HomePage from './containers/HomePage';

const containers = {
    NotFoundPage,
    BasePage,
    ArticlePage,
    HomePage,
};

import React, { PureComponent } from 'react';
import { keysToCamelFromSnake } from './utils/caseconverters';

import './styles/index.css';

class App extends PureComponent {
    render() {
        const Component = containers[this.props.component_name];
        return (
            <Component {...keysToCamelFromSnake(this.props.component_props)} />
        );
    }
}

export { App };
