const options = {
    "skip-welcome-message": {
        desc: "Skips the welcome message",
        type: Boolean
    },
    "skip-install": {
        desc: "Skips the installation of dependencies",
        type: Boolean
    },
    "test-framework": {
        desc: "Test framework to be invoked",
        type: String,
        defaults: "jest"
    }
};

module.exports = options;
