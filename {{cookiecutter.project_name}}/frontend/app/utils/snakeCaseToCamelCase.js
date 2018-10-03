function snakeToCamel (s) {
    return s.replace(/(_\w)/g, (x) => x[1].toUpperCase());
}

function snakeCaseToCamelCase (obj, removeNull = true) {
    if (Array.isArray(obj)) {
        return obj.map(snakeCaseToCamelCase);
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    let r = {};
    for (let key in obj) {
        if(removeNull && obj[key] === null) {
            continue;
        }

        r[snakeToCamel(key)] = obj[key] && typeof obj[key] === 'object'
            ? snakeCaseToCamelCase(obj[key])
            : obj[key];
    }

    return r;
}

export default snakeCaseToCamelCase;
export {
    snakeToCamel,
}
