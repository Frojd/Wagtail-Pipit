const importAllJsons = (context) => {
    const jsons = {};
    context.keys().forEach((key) => {
        jsons[
            key
                .split('/')
                .pop()
                .split('.')[0]
        ] = context(key);
    });

    for (let j in jsons) {
        let data = getData(j, jsons);
        jsons[j] = data;
    }

    return jsons;
};

const getData = (prop, jsons) => {
    let currentProp = prop;
    let subProp;
    if (prop.split('.').length) {
        currentProp = prop.split('.')[0];
        subProp = prop.split('.')[1];
    }

    let jsonString = JSON.stringify(jsons[currentProp]);

    let data = jsonString.replace(/"###(.*?)###"/g, (org, catched) => {
        let subData = getData(catched, jsons);
        return JSON.stringify(subData);
    });

    let parsedData = JSON.parse(data);
    return subProp ? parsedData[subProp] : parsedData;
};

export { importAllJsons, getData };
