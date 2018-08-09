const fs = require('fs-extra');
const path = require('path');
const Render = require('../render/render.js');
const Log = require('../utils').Log;

/* eslint-disable indent, no-unused-vars */

class Cli {
    constructor(config = {}) {
        this.config = config;
        this.componentsFolder = path.join(
            config.rootFolder, 
            config.appFolder, 
            config.componentsFolder
        )
        this.templatePath = path.join(
            process.cwd(),
            this.config.rootCliTemplatePath
        )
        this.render = new Render(this.config);
    }

    validatePath(componentPath) {
        return !fs.existsSync(componentPath);
    }

    createComponent(componentPath, componentName) {
        const config = {...this.config};

        this.createComponentFolder(componentPath);

        if(config.createIndex) {
            this.createIndexJs(componentPath, componentName);
        }
        if(config.createScss) {
            this.createComponentScss(componentPath, componentName);
        }
        if(config.createTest) {
            this.createComponentTestJs(componentPath, componentName);
        }
        if(config.createData) {
            this.createComponentData(componentPath, componentName);
        }
        if(this.config.usePure) {
            this.createPureComponentJs(componentPath, componentName);
        } else {
            this.createClassComponentJs(componentPath, componentName);
        }
        if(this.config.updateIndexJs) {
            this.addToIndexJs(componentName);
        }
        if(this.config.updateIndexScss) {
            this.addToIndexScss(componentName, componentPath);
        }
    }

    deleteComponent(componentPath, componentName) {
        this.addToIndexJs(componentName, true);
        this.addToIndexScss(componentName, componentPath, true);
        this.deleteComponentFolder(componentPath);
    }

    createComponentFolder(componentPath) {
        fs.ensureDirSync(componentPath);
        Log.info(`Created folder: ${componentPath}`)
    }
    
    createIndexJs(componentPath, componentName) {
        const filePath = path.join(componentPath, `index.js`);
        const message = `Created index.js at: ${filePath}`;
        this._createFile(filePath, componentName, 'componentIndex', message);
    }

    createPureComponentJs(componentPath, componentName) {
        const filePath = path.join(componentPath, `${componentName}.js`);
        const message = `Created ${componentName}.js at: ${filePath}`;
        this._createFile(filePath, componentName, 'componentPure', message);
    }

    createClassComponentJs(componentPath, componentName) {
        const filePath = path.join(componentPath, `${componentName}.js`);
        const message = `Created ${componentName}.js at: ${filePath}`;
        this._createFile(filePath, componentName, 'componentClass', message);
    }

    createComponentTestJs(componentPath, componentName) {
        const filePath = path.join(componentPath, `${componentName}.test.js`);
        const message = `Created ${componentName}.test.js at: ${filePath}`;
        this._createFile(filePath, componentName, 'componentTest', message);
    }

    createComponentScss(componentPath, componentName) {
        const filePath = path.join(componentPath, `${componentName}.scss`);
        const message = `Created ${componentName}.scss at: ${filePath}`;
        this._createFile(filePath, componentName, 'componentScss', message);
    }

    createComponentData(componentPath, componentName) {
        const filePath = path.join(componentPath, `${componentName}.json`);
        const message = `Created ${componentName}.json at: ${filePath}`;
        this._createFile(filePath, componentName, 'componentData', message);
    }

    scaffoldComponent(componentPath, componentName, subComponentName) {
        const templateString = this._getTemplateString('containerWithComponent');
        const template = eval('`' + templateString + '`');
        _writeFile(componentPath, template);
        const message = `Updated ${componentName}.js at: ${componentPath}`;
        Log.info(message)
    }

    addToIndexJs(componentName, remove=false) {
        const filePath = path.join(this.componentsFolder, 'index.js');
        let index = fs.readFileSync(filePath, 'utf8');
        let newComponent = `import ${componentName} from './${componentName}';
`;
    
        if(remove) {
            index = index.replace(newComponent, '');
            index = index.replace(
`
    ${componentName},`, '');
        } else {
            index = newComponent.concat(index);
            index = index.replace(`export {`, `export {
    ${componentName},`);
        }
    
        _writeFile(filePath, index);
        Log.info(`Updated index.js: ${filePath}`)
    }

    addToIndexScss(componentName, componentPath, remove=false) {
        const scssFolder = path.join(
            this.config.rootFolder, 
            this.config.appFolder, 
            this.config.scssFolder,
        );
        let scssFile = 'index.scss';
        if(componentPath.indexOf(this.config.componentsFolder) !== -1) {
            scssFile = 'components.scss';
        }
        if(componentPath.indexOf(this.config.containersFolder) !== -1) {
            scssFile = 'containers.scss';
        }
        
        const filePath = path.join(scssFolder, scssFile);

        let index = fs.readFileSync(filePath, 'utf8');
        let compPath = path.relative(scssFolder, componentPath);
        compPath = compPath.replace(/\\/g, '/');
        const importString = `@import '${compPath}/${componentName}';
`;

        if(remove) {
            index = index.replace(importString, '');
        } else {
            index = index.concat(importString);
        }
        
        _writeFile(filePath, index);
        Log.info(`Updated index.scss: ${filePath}`)
    }

    publishComponents(outputPath) {
        this.publishListing(outputPath);        
        this.publishAllComponents(outputPath);
        this.publishAllContainers(outputPath);
        this.publishDevFiles(outputPath);
        this.copyStaticFiles(outputPath);
    }

    copyStaticFiles(outputPath) {
        const config = this.config;
        fs.ensureDirSync(outputPath);
        const statics = path.join(config.rootFolder, config.outputPath);
        fs.copySync(statics, path.join(outputPath, config.publicPath))
    }

    publishDevFiles(outputPath) {
        const config = this.config;
        fs.ensureDirSync(outputPath);
        const rootTemplatePath = this.config.rootServerTemplatePath;
        const devJsPath = `${path.posix.join(config.rootFolder, rootTemplatePath, 'devserver.js')}`;
        const devJsOutputPath = path.resolve(config.rootFolder, config.outputPathHtmlFolder, `devserver.js`);
        const devJs = fs.readFileSync(devJsPath);
        const devCssPath = `${path.posix.join(config.rootFolder, rootTemplatePath, 'devserver.css')}`;
        const devCssOutputPath = path.resolve(config.rootFolder, config.outputPathHtmlFolder, `devserver.css`);
        const devCss = fs.readFileSync(devCssPath);
        _writeFile(devJsOutputPath, devJs);
        _writeFile(devCssOutputPath, devCss);
    }

    publishAllComponents(outputPath) {
        fs.ensureDirSync(outputPath);
        const components = this.render.getComponents();
        
        components.map((item) => {
            const componentFolder = path.join(outputPath, item);
            fs.ensureDirSync(componentFolder);
            const componentFile = path.join(componentFolder, `index.html`);
            const component = this.render.renderServerComponent(item);
            _writeFile(componentFile, component);
        })
    }

    publishAllContainers(outputPath) {
        fs.ensureDirSync(outputPath);
        const containers = this.render.getContainers();
        
        containers.map((item) => {
            const componentFolder = path.join(outputPath, item);
            fs.ensureDirSync(componentFolder);
            const componentFile = path.join(componentFolder, `index.html`);
            const component = this.render.renderServerComponent(item);
            _writeFile(componentFile, component);
        })
    }

    publishListing(outputPath) {
        fs.ensureDirSync(outputPath);
        const listingFile = path.join(outputPath, `index.html`);
        const listing = this.render.renderListing();
        _writeFile(listingFile, listing);
    }

    deleteComponentFolder(componentPath) {
        _deleteFolderRecursive(componentPath)
    }

    _createFile(filePath, componentName, templateName, message = ``) {
        const templateString = this._getTemplateString(templateName);
        const template = eval('`' + templateString + '`');
        _writeFile(filePath, template);
        Log.info(message)
    }

    _getTemplateString(templateName, templatePath = this.templatePath) {
        const filePath = path.join(templatePath, templateName);
        const templateString = fs.readFileSync(filePath, 'utf8');
        return templateString;
    }
}

const _deleteFolderRecursive = (localPath) => {
    if(fs.existsSync(localPath)) {
        fs.readdirSync(localPath).forEach((file) =>{
            let curPath = `${localPath}/${file}`;
            if(fs.lstatSync(curPath).isDirectory()) {
                _deleteFolderRecursive(curPath);
            } else {
                Log.info(`Deleted file: ${curPath}`);
                fs.unlinkSync(curPath);
            }
        });
        Log.info(`Deleted folder: ${localPath}`);
        fs.rmdirSync(localPath);
    }
}

const _writeFile = (filePath, content) => {
    try {
        fs.writeFileSync(filePath, content);
    } catch(e) {
        Log.error(`Failed to write filepath ${filePath} with content\n${content}\n\n${e}`, e);
    }
}

module.exports = Cli;