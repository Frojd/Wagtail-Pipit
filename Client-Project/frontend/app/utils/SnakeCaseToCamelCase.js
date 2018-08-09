function snakeToCamel (s) {
    return s.replace(/(_\w)/g, (x) => x[1].toUpperCase());
}

export default function convertObjectKeys (obj, removeNull = true) {
    if (Array.isArray(obj)) {
        return obj.map(convertObjectKeys);
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
            ? convertObjectKeys(obj[key])
            : obj[key];
    }

    return r;
}
