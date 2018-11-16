/**
 * CLI for scaffolding new components
 */

const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const webpack = require('webpack');
const glob = require('glob');
const {
    createComponent, 
    deleteComponent, 
    updateIndex
} = require('../internals/cli');

program
    .command('new <component> [subComponent...]')
    .description('Creates a new component')
    .option('-c, --container', 'Create container component')
    .option('-C, --class', 'Create class component')
    .option('-f, --folder <folder>', 'Change components folder')
    .option('-u, --updateIndexJs', 'Update index.js')
    .action((component, subComponents, options) => {
        const componentType = (options.container || options.class) ? '__Class' : '__Pure';
        let updateIndexJs = options.updateIndexJs;
        let folder = 'components';
        if(options.container) {
            folder = 'containers';
            updateIndexJs = true;
        }
        if(options.folder) {
            folder = options.folder
        }
        const rootFolder = path.join(
            process.cwd(),
            'app',
            folder
        )
        const paths = [rootFolder, component, ...subComponents];
        const componentPath = path.join(
            rootFolder,
            component,
            ...subComponents
        );
        
        if(fs.existsSync(componentPath)) {
            throw new Error(`Component already exists at: ${componentPath}`);
        }
        const componentName = paths[paths.length-1];
        
        createComponent(componentPath, componentName, componentType);
        if(updateIndexJs) {
            updateIndex(componentName, `./${folder}/${componentName}`);
        }

        console.log(`Created new component at ${componentPath}`);
    });

program.command('delete <componentName> [subComponent...]')
    .option('-c, --container', 'Create container component')
    .option('-f, --folder <folder>', 'Change components folder')
    .action((component, subComponents, options) => {
        let folder = 'components';
        if(options.container) {
            folder = 'containers';
        }
        if(options.folder) {
            folder = options.folder
        }
        const rootFolder = path.join(
            process.cwd(),
            'app',
            folder
        )
        const paths = [rootFolder, component, ...subComponents];
        const componentPath = path.join(
            rootFolder,
            component,
            ...subComponents
        );
        
        if(!fs.existsSync(componentPath)) {
            throw new Error(`Component does not exists at: ${componentPath}`);
        }
        const componentName = paths[paths.length-1];
        deleteComponent(componentPath, componentName);
        updateIndex(componentName, `./${folder}/${componentName}`, true)

        console.log(`Deleted component at ${componentPath}`);
    });

program.command('scaffold')
    .option('-e, --empty', 'Start empty folders')
    .action((options) => {
        const fromFolder = options.empty ? 'empty': 'example';
    
        const from = path.join('internals', fromFolder);
        const to = path.join(process.cwd(), 'app');

        if(fs.existsSync(path.join(to, 'components'))) {
            throw new Error(`Project already initialized, please empty the app folder`);
        }

        fs.copySync(
            path.join(from), 
            path.join(to)
        );

        console.log(`Scaffolded a new project`);
    });

program.parse(process.argv);
