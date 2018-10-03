function camelToSnake (s) {
    return s.replace(/[A-Z]/g, (x) => '_' + x.toLowerCase());
}

function camelCaseToSnakeCase (obj) {
    if (Array.isArray(obj)) {
        return obj.map(camelCaseToSnakeCase);
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    let r = {};
    for (let key in obj) {
        r[camelToSnake(key)] = obj[key] && typeof obj[key] === 'object'
            ? camelCaseToSnakeCase(obj[key])
            : obj[key];
    }

    return r;
}

export default camelCaseToSnakeCase;
export {
    camelToSnake,
}
