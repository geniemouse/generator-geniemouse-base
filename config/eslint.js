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
    return {
        env: setEnv(data.includeJest),
        extends: setExtends(data.includePrettier),
        plugins: setPlugins(data.includePrettier)
    };
};
