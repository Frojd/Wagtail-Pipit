/* global process module */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const createComponent = function(componentPath, componentName, componentType) {
    const from = path.join(process.cwd(), 'cli', componentType);
    const to = path.join(componentPath);
    fs.copySync(path.join(from), path.join(to));

    remapComponents(componentPath, componentName, componentType);
};

const deleteComponent = function(componentPath) {
    const componentToDelete = path.join(componentPath);
    fs.removeSync(componentToDelete);
};

const remapComponents = function(componentPath, componentName, componentType) {
    const files = glob.sync(`${componentPath}/**/*`);
    files.map((file) => {
        const componentFile = path.join(file);
        replaceInFile(componentFile, componentType, componentName);
        const replacedFile = componentFile.replace(
            componentType,
            componentName
        );
        fs.renameSync(componentFile, replacedFile);
    });
};

const replaceInFile = function(file, replace, replacement) {
    const content = fs.readFileSync(file, 'utf8');
    const re = new RegExp(replace, 'g');
    const result = content.replace(re, replacement);
    fs.writeFileSync(file, result, 'utf8');
};

module.exports = {
    createComponent,
    deleteComponent,
};
