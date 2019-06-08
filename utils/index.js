// @TODO: Preferred package.json order:
// const pkgOrder = [
//     "name",
//     "version",
//     "description",
//     "private",
//     "keywords",
//     "license",
//     "author",
//     "main",
//     "scripts",
//     "files",
//     "engines",
//     "jest",
//     "prettier",
//     "dependencies",
//     "devDependencies",
//     "peerDependencies",
//     "repository",
//     "bugs",
//     "homepage"
// ];

const usernamePattern = /^@[a-z0-9-]+\//i;

function isObject(obj) {
    return typeof obj !== "undefined" && (obj instanceof Object && !Array.isArray(obj));
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
    // pkgOrder,
    sortByKeyName,
    usernamePattern
};
