/* global beforeAll afterAll */

import path from 'path';
import fs from 'fs-extra';
import Cli from '../cli/cli';
import Render from './render';

const testFolder = path.join(process.cwd(), 'tmp_testRender');
const mainConfig = require('../config.js')();
const testConfig = {
    rootFolder: testFolder
}
const config = Object.assign(mainConfig, testConfig);
const cli = new Cli(config);
const render = new Render(config);
const rootFolder = path.join(
    config.rootFolder, 
    config.appFolder, 
    config.componentsFolder
)
const containerFolder = path.join(
    config.rootFolder, 
    config.appFolder, 
    config.containersFolder
)
const componentName = 'MainComponent';

describe('Test render of a component', () => {
    beforeAll(() => {
        console.info = () => {};

        // Generate essential files
        const scssFolder = path.join(config.rootFolder, config.appFolder, config.scssFolder);
        const appIndexJs = path.join(rootFolder, 'index.js');
        const appIndexScss = path.join(scssFolder, 'index.scss');
        const componentScss = path.join(scssFolder, 'components.scss');
        const containersScss = path.join(scssFolder, 'containers.scss');
        const indexJsContent = `
    export {
    };`;
        fs.ensureDirSync(rootFolder);
        fs.ensureDirSync(containerFolder);
        fs.ensureDirSync(scssFolder);
        fs.writeFileSync(appIndexJs, indexJsContent);
        fs.createFileSync(componentScss);
        fs.createFileSync(containersScss);
        fs.createFileSync(appIndexScss);
        const folderPath = path.join(rootFolder, componentName);
        cli.createComponent(folderPath, componentName);
    });

    it('Renders a component', () => {
        const renderedComponent = render.renderComponent(componentName);   
        expect(renderedComponent).toMatchSnapshot();
    })

    it('Renders a list of components', () => {
        const listOfComponents = render.renderListing();
        expect(listOfComponents).toMatchSnapshot();
    })

    it('GetComponents returns a list of components', () => {
        const components = render.getComponents();
        expect(components).toHaveLength(1);
        expect(components).toContain(componentName);
    })

    it('GetContainers returns a list of containers', () => {
        const components = render.getContainers();
        expect(components).toHaveLength(0);
    })
    
    it('Renders a servercomponent', () => {
        const component = render.renderServerComponent(componentName);
        expect(component).toMatchSnapshot();
    })

    afterAll(() => {
        cli.deleteComponentFolder(testFolder);
    });
});