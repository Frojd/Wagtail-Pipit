import React, { PureComponent } from 'react';
import { keysToCamelFromSnake } from '../../utils/caseconverters';
import './App.scss';

class App extends PureComponent {
    render() {
        const {
            component_name,
            component_props
        } = this.props;

        const Component = require(`../../containers/${component_name}`).default;
        
        return (
            <Component {...keysToCamelFromSnake(component_props)} />
        );
    }
}

export default App;
