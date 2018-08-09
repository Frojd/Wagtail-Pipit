/* global beforeAll afterAll */

import path from 'path';
import fs from 'fs-extra';

import Cli from './cli.js';

const testFolder = path.join(process.cwd(), 'tmp_testCli');
const testConfig = {
    rootFolder: testFolder
}
const config = require('../config.js')(testConfig);

const cli = new Cli(config);
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
const subComponentName = 'SubComponent';
const containerName = 'MyContainer';

describe('Test CLI functions', () => {
    beforeAll(() => {
        // Remove logging info
        console.info = () => {};
    
        // Generate essential files
        const scssFolder = path.join(config.rootFolder, config.appFolder, config.scssFolder);
        const appIndexJs = path.join(rootFolder, 'index.js');
        const containerIndexJs = path.join(containerFolder, 'index.js');
        const appIndexScss = path.join(scssFolder, 'index.scss');
        const componentScss = path.join(scssFolder, 'components.scss');
        const containersScss = path.join(scssFolder, 'containers.scss');
        const indexJsContent = `
export {
};`;
        const devServerTemplateFolder = path.join(config.rootFolder, config.rootServerTemplatePath);
        fs.ensureDirSync(rootFolder);
        fs.ensureDirSync(scssFolder);
        fs.ensureDirSync(containerFolder);
        fs.ensureDirSync(devServerTemplateFolder);
        fs.writeFileSync(path.join(devServerTemplateFolder, 'devserver.css'), 'hej');
        fs.writeFileSync(path.join(devServerTemplateFolder, 'devserver.js'), 'hej');
        fs.writeFileSync(appIndexJs, indexJsContent);
        fs.writeFileSync(containerIndexJs, indexJsContent);
        fs.createFileSync(appIndexScss);
        fs.createFileSync(componentScss);
        fs.createFileSync(containersScss);
    });
    
    describe('Create a classbased component', () => {
        it('Create MainComponent', () => {
            const folderPath = path.join(rootFolder, componentName);
            cli.createComponent(folderPath, componentName);
            expect(fs.existsSync(folderPath)).toBe(true);
        });

        it('Check content of MainComponent index.js', () => {
            const filePath = path.join(rootFolder, componentName, `index.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Check content of class MainComponent.js', () => {
            const filePath = path.join(rootFolder, componentName, `${componentName}.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Check content of MainComponent.test.js', () => {
            const filePath = path.join(rootFolder, componentName, '', `${componentName}.test.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Check content of classbased MainComponent.scss', () => {
            const filePath = path.join(rootFolder, componentName, `${componentName}.scss`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Check content of classbased MainComponent.json', () => {
            const filePath = path.join(rootFolder, componentName, `${componentName}.json`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });
        
        it('Should have updated app index.js', () => {
            const filePath = path.join(rootFolder, `index.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should have updated app components.scss', () => {
            const scssFolder = path.join(config.rootFolder, config.appFolder, config.scssFolder);
            const filePath = path.join(scssFolder, `components.scss`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });
    })

    describe('Test pure based subcomponent', () => {
        beforeAll(() => {
            // Change config to pure and don't update files
            cli.config.createPure = true;
            cli.config.createClass = false;
            cli.config.updateIndexJs = false;
            cli.config.updateIndexScss = false;
        });
        
        it('Create SubComponent', () => {
            const folderPath = path.join(rootFolder, componentName, subComponentName);
            cli.createComponent(folderPath, subComponentName);
            expect(fs.existsSync(folderPath)).toBe(true);
        });
    
        it('Check content of SubComponent index.js', () => {
            const filePath = path.join(rootFolder, componentName, subComponentName, `index.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Check content of pure SubComponent.js', () => {
            const filePath = path.join(rootFolder, componentName, subComponentName, `${subComponentName}.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Check content of SubComponent.test.js', () => {
            const filePath = path.join(rootFolder, componentName, subComponentName, `${subComponentName}.test.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Check content of SubComponent.scss', () => {
            const filePath = path.join(rootFolder, componentName, subComponentName, `${subComponentName}.scss`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Check content of SubComponent.json', () => {
            const filePath = path.join(rootFolder, componentName, `${componentName}.json`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should NOT have updated app index.js', () => {
            const filePath = path.join(rootFolder, `index.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should NOT have updated app components.scss', () => {
            const scssFolder = path.join(config.rootFolder, config.appFolder, config.scssFolder);
            const filePath = path.join(scssFolder, `components.scss`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });
    })

    describe('Create containers', () => {
        it('Should create a container component folder', () => {
            const folderPath = path.join(containerFolder, containerName);
            cli.createComponent(folderPath, containerName);
            expect(fs.existsSync(folderPath)).toBe(true);
        })

        it('Check content of class MyContainer.js', () => {
            const filePath = path.join(containerFolder, containerName, `${containerName}.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should have updated container index.js', () => {
            const filePath = path.join(containerFolder, `index.js`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should have updated app containers.scss', () => {
            const scssFolder = path.join(config.rootFolder, config.appFolder, config.scssFolder);
            const filePath = path.join(scssFolder, `containers.scss`);
            const template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });
    })

    describe('Publish components', () => {
        beforeAll(() => {
            fs.ensureDirSync(path.join(testFolder, config.outputPath, config.publicPath))
            fs.ensureDirSync(path.join(testFolder, config.outputPathHtmlFolder, 
                config.publicPath, config.outputPathJsFolder))
            fs.ensureDirSync(path.join(testFolder, config.outputPathHtmlFolder, 
                config.publicPath, config.outputPathCssFolder))
            fs.writeFileSync(path.join(testFolder, config.outputPathHtmlFolder, 
                config.publicPath, config.outputPathCssFolder, 'index.css'), 'css')
            fs.writeFileSync(path.join(testFolder, config.outputPathHtmlFolder, 
                config.publicPath, config.outputPathJsFolder, 'index.js'), 'js')
        });

        it('Should create html folder and files', () => {
            const htmlPath = path.join(testFolder, config.outputPathHtmlFolder);
            cli.publishComponents(htmlPath);
            expect(fs.existsSync(htmlPath)).toBe(true);
        });
        
        it('Should have a listing file', () => {
            const htmlPath = path.join(testFolder, config.outputPathHtmlFolder, `index.html`);
            const template = fs.readFileSync(htmlPath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should have a component file', () => {
            const htmlPath = path.join(testFolder, config.outputPathHtmlFolder, `${componentName}`, `index.html`);
            const template = fs.readFileSync(htmlPath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should have a dev css file', () => {
            const htmlPath = path.join(testFolder, config.outputPathHtmlFolder, `devserver.css`);
            const template = fs.readFileSync(htmlPath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should have a dev js file', () => {
            const htmlPath = path.join(testFolder, config.outputPathHtmlFolder, `devserver.js`);
            const template = fs.readFileSync(htmlPath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should have a static folder', () => {
            const htmlPath = path.join(testFolder, config.outputPathHtmlFolder, config.publicPath);
            expect(fs.existsSync(htmlPath)).toBe(true);
        });

        it('Should have a static css file', () => {
            const htmlPath = path.join(
                testFolder, 
                config.outputPathHtmlFolder, config.publicPath, config.outputPathCssFolder, `index.css`);
            const template = fs.readFileSync(htmlPath, 'utf8')
            expect(template).toMatchSnapshot();
        });

        it('Should have a static js file', () => {
            const htmlPath = path.join(
                testFolder, 
                config.outputPathHtmlFolder, config.publicPath, config.outputPathJsFolder, `index.js`);
            const template = fs.readFileSync(htmlPath, 'utf8')
            expect(template).toMatchSnapshot();
        });
    })

    describe('Delete components', () => {
        it('Deletes subcomponent folder and files', () => {
            const folderPath = path.join(rootFolder, componentName, subComponentName);
            cli.deleteComponent(folderPath, subComponentName);
            expect(fs.existsSync(folderPath)).toBe(false);

            const scssFolder = path.join(config.rootFolder, config.appFolder, config.scssFolder);
            let filePath = path.join(scssFolder, `components.scss`);
            let template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();

            filePath = path.join(rootFolder, `index.js`);
            template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });
    
        it('Deletes component folder and files', () => {
            const folderPath = path.join(rootFolder, componentName);
            cli.deleteComponent(folderPath, componentName);
            expect(fs.existsSync(folderPath)).toBe(false);

            const scssFolder = path.join(config.rootFolder, config.appFolder, config.scssFolder);
            let filePath = path.join(scssFolder, `index.scss`);
            let template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();

            filePath = path.join(rootFolder, `index.js`);
            template = fs.readFileSync(filePath, 'utf8')
            expect(template).toMatchSnapshot();
        });
    })

    afterAll(() => {
        cli.deleteComponentFolder(testFolder);
    });
});