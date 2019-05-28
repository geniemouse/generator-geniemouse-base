var Generator = require("yeoman-generator");

module.exports = class extends Generator {
    constructor(args, opts) {
        // Don't replace Generator's parameters
        super(args, opts);
        // Add custom code
        this.option("babel"); // Adds support for a `--babel` flag
    }

    method1() {
        this.log("method 1 just ran");
    }

    method2() {
        this.log("method 2 just ran");
    }
};
