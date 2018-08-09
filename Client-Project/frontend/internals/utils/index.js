/* eslint-disable no-undef, no-unused-vars */

const fs = require('fs');
const path = require('path');

const config = require('../config')();

const rootFolder = process.cwd();
const componentPath = path.join(config.appFolder, config.componentsFolder);

const getAllJsonFiles = () => {
    const componentsFolder = path.join(
        process.cwd(), 
        config.appFolder, 
        config.componentsFolder
    )
    const containersFolder = path.join(
        process.cwd(), 
        config.appFolder, 
        config.containersFolder
    )
    
    const jsonFiles = {
        ...getFilesByExtension(componentsFolder, '.json'), 
        ...getFilesByExtension(containersFolder, '.json')
    };

    return jsonFiles;
}

const getData = (componentName, components = null) => {
    components = components || getAllJsonFiles();
    
    let currentProp = componentName;
    let subProp;
    if(componentName.split('.').length) {
        currentProp = componentName.split('.')[0];
        subProp = componentName.split('.')[1];
    }
    
    let jsonString = JSON.stringify(components[currentProp])
    
    let data = jsonString.replace(/"###(.*?)###"/g, (org, catched) => {
        let subData = getData(catched);
        return JSON.stringify(subData);
    })
    
    let parsedData = JSON.parse(data);
    return subProp ? parsedData[subProp] : parsedData;
}

const getFilesByExtension = (startPath, filter, allFiles = {}) =>{
    if (!fs.existsSync(startPath)){
        return;
    }

    let files = fs.readdirSync(startPath);
    for(let i=0; i < files.length; i++){
        let filename=path.join(startPath, files[i]);
        let stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            getFilesByExtension(filename, filter, allFiles);
        }
        else if (filename.endsWith(filter)) {
            let normalizedFile = path.posix.normalize(filename);
            let name = normalizedFile.split(path.sep).pop().split('.')[0];
            
            if(filter === '.json') {
                allFiles[name] = require(normalizedFile);
            } else {
                allFiles[name] = normalizedFile;
            }
            
        }
    }

    return allFiles;
}

const purgeCache = (moduleName) => {
    Object.keys(require.cache).forEach(function(key) {
        
        delete require.cache[key];
        
    });
}

class Log {
    static info(message) {
        console.info(message);
    }
    static error(message) {
        console.error(message);
    }
}

module.exports = {
    getData,
    purgeCache,
    getFilesByExtension,
    Log
}
