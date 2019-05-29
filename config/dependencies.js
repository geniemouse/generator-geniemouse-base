const { sortByKeyName } = require("../utils");

const devDependencies = {
    eslint: {
        "eslint": "^5.16.0",
        "eslint-config-airbnb-base": "^13.1.0",
        "eslint-plugin-import": "^2.17.3"
    },
    prettier: {
        "@geniemouse/prettier-config": "^1.1.3",
        "prettier": "^1.17.1"
    },
    eslintPrettier: {
        "eslint-config-prettier": "^4.3.0",
        "eslint-plugin-prettier": "^3.1.0"
    }
};

function getFeatureObject(feature, returnObj) {
    return feature ? returnObj : {};
}

function setDevDependencies(data) {
    const collection = Object.assign(
        {},
        getFeatureObject(data.includeESLint, devDependencies.eslint),
        getFeatureObject(data.includePrettier, devDependencies.prettier),
        getFeatureObject(data.includeESLint && data.includePrettier, devDependencies.eslintPrettier)
    );
    // Sorting by keyname is an optional nicety;
    // consistentcy with how packages are normally listed in `package.json`
    return sortByKeyName(collection);
}

module.exports = function createPackageDependencies(data) {
    return {
        dependencies: {},
        devDependencies: setDevDependencies(data),
        peerDependencies: {}
    };
};
