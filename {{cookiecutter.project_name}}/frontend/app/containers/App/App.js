import React, { PureComponent } from 'react';
//import './ArticlePage.css';

import snakeCaseToCamelCase from '../../utils/snakeCaseToCamelCase';
import * as containers from '../../';

const withSnakeToCamelCaseProps = Comp => props => (
    <Comp {...snakeCaseToCamelCase(props)} />
);

class App extends PureComponent {
    static defaultProps = {
        componentName: null,
        props: {}
    };

    render() {
        const { componentName, componentProps } = this.props;
        const Component = containers[componentName];

        return <Component {...componentProps} />;
    }
}

export default withSnakeToCamelCaseProps(App);
