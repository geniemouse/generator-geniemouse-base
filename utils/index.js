/**
 * Utility: Create an object with alphabetized key names from another
 * - Although this doesn't matter to JS, humans will find this easier to parse
 * @param  {Object} obj
 * @return {Object}
 */
function sortByKeyName(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
            result[key] = obj[key];
            return result;
        }, {});
}

module.exports = {
    sortByKeyName
};
