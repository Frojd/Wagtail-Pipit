import React, { PureComponent } from 'react';
import { keysToCamelFromSnake } from 'utils/caseconverters';
import cache from '../../containers';
import './App.scss';


class App extends PureComponent {
    render() {
        const camelProps = { ...keysToCamelFromSnake(this.props) };
        const { componentName, componentProps } = camelProps;

        if (!componentName) {
            return false;
        }

        const Component = cache[componentName];
        return <Component {...keysToCamelFromSnake(componentProps)} />;
    }
}

export default App;
