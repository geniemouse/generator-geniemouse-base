const { configArray, configObject } = require("../utils");

function setEnv(jest) {
    return configObject(jest, {
        jest: true
    });
}

function setExtends(prettier) {
    const extendsList = ["airbnb-base"];
    if (prettier) {
        extendsList.push("prettier");
    }
    return extendsList;
}

function setPlugins(prettier) {
    return configArray(prettier, ["prettier"]);
}

module.exports = function makeESlintConfig(data) {
    const { includeJest, includePrettier } = data.features;
    return {
        env: setEnv(includeJest),
        extends: setExtends(includePrettier),
        plugins: setPlugins(includePrettier)
    };
};
