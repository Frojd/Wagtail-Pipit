/**
 * CLI for scaffolding new components
 */

const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const Cli = require('../internals/cli/cli.js');

program
    .command('new <component> [subComponent...]')
    .description('Creates a new component')
    .option('-c, --class', 'Create class component')
    .option('-p, --pure', 'Create pure component')
    .option('-s, --scss', 'Create scss file')
    .option('-t, --test', 'Create test.js file')
    .option('-d, --data', 'Create data json file')
    .option('-i, --index', 'Create index.js file')
    .option('-C, --componentsFolder <cFolder>', 'Change components folder')
    .option('-I, --append-index', 'Append to index.js')
    .option('-S, --append-scss', 'Append to index.scss')
    .action((component, subComponents, options) => {
        let overrides = {}
        if(options.class) {overrides.createClass = false;}
        if(options.pure) {overrides.createPure = true;}
        if(options.scss) {overrides.createScss = false;}
        if(options.test) {overrides.createTest = false;}
        if(options.index) {overrides.createIndex = false;}
        if(options.appendIndex) {overrides.updateIndexJs = false;}
        if(options.appendScss) {overrides.updateIndexScss = false;}
        if(options.componentsFolder) {overrides.componentsFolder = options.componentsFolder}
        
        if(subComponents.length) {
            overrides.updateIndexScss = false;
            overrides.updateIndexJs = false;
        }
        
        const config = require('../internals/config.js')(overrides);
        const rootFolder = path.join(
            config.rootFolder, 
            config.appFolder, 
            config.componentsFolder
        )
        const paths = [rootFolder, component, ...subComponents];
        const componentPath = path.join(
            rootFolder,
            component,
            ...subComponents
        );
        
        const cli = new Cli(config);
        if(!cli.validatePath(componentPath)) {
            throw new Error(`Component already exists at: ${componentPath}`);
        }
        
        cli.createComponent(componentPath, paths[paths.length-1]);
    });

program.command('delete <componentName> [subComponent...]')
    .option('-C, --componentsFolder <cFolder>', 'Change components folder')
    .action((component, subComponents, options) => {
        let overrides = {}
        if(options.componentsFolder) {overrides.componentsFolder = options.componentsFolder}

        const config = require('../internals/config.js')(overrides);
        const rootFolder = path.join(
            config.rootFolder, 
            config.appFolder, 
            config.componentsFolder
        )
        const paths = [rootFolder, component, ...subComponents];
        const componentPath = path.join(
            rootFolder,
            component,
            ...subComponents
        );
        
        const cli = new Cli(config);
        if(cli.validatePath(componentPath)) {
            throw new Error(`Component doesn't exist at: ${componentPath}`);
        }
        
        cli.deleteComponent(componentPath, paths[paths.length-1]);
    });

program.command('publish [componentName]')
    .action(() => {
        const overrides = {
            rootFolder: process.cwd()
        };
        require('babel-register');
        const config = require('../internals/config.js')(overrides);
        const cli = new Cli(config);
        const outputPath = path.join(
            config.rootFolder,
            config.outputPathHtmlFolder
        );
        cli.publishComponents(outputPath);
    })

program.command('scaffold [outputPath]')
    .option('--componentName <componentName>')
    .option('--containerName <containerName>')
    .action((outputPath, options) => {
        const config = require('../internals/config.js')();
        const cli = new Cli(config);
        const rootFolder = path.join(
            config.rootFolder, 
            config.appFolder
        )

        const componentName = options.componentName || 'Hero';
        const componentPath = path.join(rootFolder, config.componentsFolder, componentName);
        if(!cli.validatePath(componentPath)) {
            throw new Error(`Component already exists at: ${componentPath}`);
        }
        cli.createComponent(componentPath, componentName);

        const containerName = options.containerName || 'HomePage';
        const containerPath = path.join(rootFolder, config.containersFolder, containerName);
        cli.componentsFolder = path.join(rootFolder, config.containersFolder);
        cli.createComponent(containerPath, containerName);
        const container = path.join(containerPath, `${containerName}.js`);
        cli.scaffoldComponent(container, containerName, componentName);

        const rcFilePath = path.join(process.cwd(), 'internals', '.frontendrc');
        let rcFileContent = fs.readFileSync(rcFilePath, 'utf8');
        if(outputPath) {
            rcFileContent = rcFileContent.replace(
                '"outputPath": "dist/static",',
                `"outputPath": "${outputPath}",`
            )
        }
        fs.writeFileSync(path.join(process.cwd(), '.frontendrc'), rcFileContent);

        if(outputPath) {
            const packageJson = path.join(process.cwd(), 'package.json');
            let packageJsonContent = fs.readFileSync(packageJson, 'utf8').replace(
                /\.\/dist\/raw/g,
                `${outputPath}/raw`
            );
            fs.writeFileSync(packageJson, packageJsonContent);
        }
    })

program.parse(process.argv);
