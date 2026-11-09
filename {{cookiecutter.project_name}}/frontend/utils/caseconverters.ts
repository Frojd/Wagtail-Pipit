type Primitive = string | number | boolean | null | undefined;

export type KeyConvertible =
    Primitive | KeyConvertible[] | { readonly [key: string]: KeyConvertible };

const snakeToCamel = (s: string) => {
    return s.replace(/(_\w)/g, (x) => x[1].toUpperCase());
};

const ucFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const snakeToPascal = (s: string) => s.split('_').map(ucFirst).join('');
const camelToPascal = (s: string) => ucFirst(s);

/**
 * @link https://github.com/peet/camel-to-snake/blob/master/index.js
 */
const camelToSnake = (s: string) => {
    return s
        .replace(
            /([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g,
            function (_, $1: string, $2: string) {
                return $1 + ($2 && '_' + $2);
            }
        )
        .toLowerCase();
};

const keysToSnakeFromCamel = (obj: KeyConvertible, removeNull = true) =>
    convertObjectKeys(obj, removeNull, camelToSnake);

const keysToCamelFromSnake = (obj: KeyConvertible, removeNull = true) =>
    convertObjectKeys(obj, removeNull);

const convertObjectKeys = (
    obj: KeyConvertible,
    removeNull = true,
    converter = snakeToCamel
): KeyConvertible => {
    if (Array.isArray(obj)) {
        return obj.map((x) => convertObjectKeys(x, removeNull, converter));
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    const r: { [key: string]: KeyConvertible } = {};
    for (const key in obj) {
        if (removeNull && obj[key] === null) {
            continue;
        }

        r[converter(key)] =
            obj[key] && typeof obj[key] === 'object'
                ? convertObjectKeys(obj[key], removeNull, converter)
                : obj[key];
    }

    return r;
};

export {
    ucFirst,
    convertObjectKeys,
    snakeToCamel,
    snakeToPascal,
    camelToPascal,
    camelToSnake,
    keysToSnakeFromCamel,
    keysToCamelFromSnake,
};
