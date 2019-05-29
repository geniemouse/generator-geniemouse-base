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

function configTemplate(options) {
    const { feature, settings, empty } = options;
    return feature ? settings : empty;
}

function configArray(feature, settings) {
    return configTemplate({ feature, settings, empty: [] });
}

function configObject(feature, settings) {
    return configTemplate({ feature, settings, empty: {} });
}

function configOrUndefined(feature, settings) {
    if (!feature) {
        return undefined;
    }
    return settings;
}

module.exports = {
    configArray,
    configObject,
    configOrUndefined,
    sortByKeyName
};
