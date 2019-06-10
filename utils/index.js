const pkgOrder = [
    "private",
    "name",
    "version",
    "description",
    "keywords",
    "author",
    "license",
    "main",
    "scripts",
    "files",
    "engines",
    "jest",
    "prettier",
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "repository",
    "bugs",
    "homepage"
];

const usernamePattern = /^@[a-z0-9-]+\//i;

function configArray(statement, settings) {
    return statement ? settings : [];
}

function isObject(obj) {
    return typeof obj !== "undefined" && (obj instanceof Object && !Array.isArray(obj));
}

function sanitizeData(keys, data) {
    if (!isObject(data)) {
        return {};
    }
    return keys.reduce((accumulator, key) => {
        const value = data[key];
        if (typeof value !== "undefined") {
            accumulator[key] = value;
        }
        return accumulator;
    }, {});
}

/**
 * Utility: Create an object with alphabetized key names from another
 * - Although this doesn't matter to JS, humans will find this easier to parse
 * @param  {Object} obj
 * @return {Object}
 */
function sortByKeyName(obj) {
    if (!isObject(obj)) {
        return obj;
    }
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
            result[key] = obj[key];
            return result;
        }, {});
}

module.exports = {
    configArray,
    isObject,
    pkgOrder,
    sanitizeData,
    sortByKeyName,
    usernamePattern
};
