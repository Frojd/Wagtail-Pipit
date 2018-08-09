function camelToSnake (s) {
    return s.replace(/[A-Z]/g, (x) => '_' + x.toLowerCase());
}

export default function convertObjectKeys (obj) {
    if (Array.isArray(obj)) {
        return obj.map(convertObjectKeys);
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    let r = {};
    for (let key in obj) {
        r[camelToSnake(key)] = obj[key] && typeof obj[key] === 'object'
            ? convertObjectKeys(obj[key])
            : obj[key];
    }

    return r;
}
