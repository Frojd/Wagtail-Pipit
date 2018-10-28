const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const createComponent = function(componentPath, componentName, componentType) {
    const from = path.join(process.cwd(), 'internals', 'cli', componentType);
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

const updateIndex = function(componentName, componentPath, remove) {
    const indexPath = path.join(process.cwd(), 'app', 'index.js');

    let index = fs.readFileSync(indexPath, 'utf8');
    let newComponent = `import ${componentName} from '${componentPath}';
`;

    if (remove) {
        index = index.replace(newComponent, '');
        index = index.replace(
            `
    ${componentName},`,
            ''
        );
    } else {
        index = newComponent.concat(index);
        index = index.replace(
            `const containers = {`,
            `const containers = {
    ${componentName},`
        );
    }

    fs.writeFileSync(indexPath, index);
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
    updateIndex,
};
