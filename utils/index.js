const usernamePattern = /^@[a-z0-9-]+\//i;

function hasDataSpaces(fileData) {
    return /<%[=_-].*%>/g.test(JSON.stringify(fileData));
}

function isObject(obj) {
    return typeof obj !== "undefined" && (obj instanceof Object && !Array.isArray(obj));
}

function sanitizeData(keys, data) {
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

function isPackageJson(filepath) {
    return /(package\.json)$/i.test(filepath);
}

function priorityPackageData(packageData) {
    return sanitizeData(["name", "description", "version"], packageData);
}

function sortPackageJson(data) {
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

    data.dependencies = sortByKeyName(data.dependencies);
    data.devDependencies = sortByKeyName(data.devDependencies);
    data.peerDependencies = sortByKeyName(data.peerDependencies);

    return sanitizeData(pkgOrder, data);
}

module.exports = {
    hasDataSpaces,
    isPackageJson,
    priorityPackageData,
    sortPackageJson,
    usernamePattern
};
