import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'
import * as Components from './components';
import * as Containers from './containers';
let jsons = {};

const jsonIds = require.context('./', true, /\.json$/);
importAllJsons(jsonIds);

const componentName = location.pathname.replace('/', '')

let Component;
let props = jsons[componentName];

Component = Components[componentName];

if(!Component) {
    Component = Containers[componentName];
}

const render = (Component, props) => {
    ReactDOM.render(
        <AppContainer>
            {Component ? 
                <Component {...props} />
                :
                <div />
            }
        </AppContainer>,
        document.getElementById('root'),
    )
}

render(Component, props);

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept(['./components', './containers'], () => {
        const componentName = location.pathname.replace('/', '')
        const Components = require('./components');
        const Containers = require('./containers');
        
        Component = Components[componentName];
        
        if(!Component) {
            Component = Containers[componentName];
        }

        render(Component, props);
    });
}

// Handle json props
function importAllJsons (r) {
    r.keys().forEach((key) => {
        jsons[key.split('/').pop().split('.')[0]] = r(key)
    });

    for(let j in jsons) {
        let data = getData(j);
        jsons[j] = data;
    }
}

function getData(prop) {
    let currentProp = prop;
    let subProp;
    if(prop.split('.').length) {
        currentProp = prop.split('.')[0];
        subProp = prop.split('.')[1];
    }
    
    let jsonString = JSON.stringify(jsons[currentProp])
    
    let data = jsonString.replace(/"###(.*?)###"/g, (org, catched) => {
        let subData = getData(catched);
        return JSON.stringify(subData);
    })
    
    let parsedData = JSON.parse(data);
    return subProp ? parsedData[subProp] : parsedData;
}