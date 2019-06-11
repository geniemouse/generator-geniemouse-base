/**
 * Basic pattern match for @-prefixed usernames at start of a string
 * @type {RegExp}
 */
const usernamePattern = /^@[a-z0-9-]+\//i;

/**
 * Check if input is real JavaScript object
 * @param  {*}  obj
 * @return {Boolean}
 */
function isObject(obj) {
    return typeof obj !== "undefined" && (obj instanceof Object && !Array.isArray(obj));
}

/**
 * Check raw (pre-processed) template file data to see if it contains any data holes
 * - Based on this check, can determine whether to use `this.fs.copy(...)` or `this.fs.copyTpl(...)`
 * @param  {Object}  fileData
 * @return {Boolean}
 */
function hasDataSpaces(fileData) {
    return /<%[=_-].*%>/g.test(JSON.stringify(fileData));
}

/**
 * Collect & return set of keynames/defined values as an object
 * - Strips keys with undefined values
 * @param  {Array} keys
 * @param  {Object} data
 * @return {Object}
 */
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
 * Alphabetize an object's key name order
 * - Although JS doesn't care, humans will find this easier to parse
 * - When used on `package.json` data, consistent with how `yarn`/`npm` add package dependencies
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

/**
 * Simple string test for `package.json` file/filepath
 * @param  {String}  filepath
 * @return {Boolean}
 */
function isPackageJson(filepath) {
    return /(package\.json)$/i.test(filepath);
}

/**
 * Priority `package.json` keynames: the items filled-in by user in main generator's prompts
 * @param  {object} packageData
 * @return {Object}
 */
function priorityPackageData(packageData) {
    return sanitizeData(["name", "description", "version"], packageData);
}

/**
 * Personal preference order for `package.json` keynames, for consistency
 * @param  {Object} data
 * @return {Object}
 */
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
