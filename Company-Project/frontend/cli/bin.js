/**
 * CLI for scaffolding new components
 */

/* global process */

const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const { createComponent, deleteComponent } = require('./cli');

program
    .command('new <component> [subComponent...]')
    .description('Creates a new component')
    .option('-c, --container', 'Create container component')
    .option('-C, --class', 'Create class component')
    .option('-f, --folder <folder>', 'Change components folder')
    .action((component, subComponents, options) => {
        const componentType = options.class ? '__Class' : '__Pure';
        let folder = 'components';
        if (options.container) {
            folder = 'containers';
        }
        if (options.folder) {
            folder = options.folder;
        }
        const rootFolder = path.join(process.cwd(), folder);
        const paths = [rootFolder, component, ...subComponents];
        const componentPath = path.join(
            rootFolder,
            component,
            ...subComponents
        );

        if (fs.existsSync(componentPath)) {
            throw new Error(`Component already exists at: ${componentPath}`);
        }
        const componentName = paths[paths.length - 1];

        createComponent(componentPath, componentName, componentType);

        console.log(`Created new component at ${componentPath}`);
    });

program.parse(process.argv);
