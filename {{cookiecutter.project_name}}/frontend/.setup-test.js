import glob from 'glob';
import path from 'path';
import { getData } from './internals/utils';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
// Prefetch all jsons before doing all tests
global.__jsons = getJsonData();

// Returns all json data
function getJsonData() {
    const jsonFiles = glob.sync('./app/**/*.json').reduce((acc, file) => {
        const name = path.basename(file, '.json');
        const json = require(file);
        acc[name] = json;
        return acc;
    }, {});
    
    const data = {};
    for(let key in jsonFiles) {
        data[key] = getData(key, jsonFiles);
    }
    return data;
}
