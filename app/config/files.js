const files = {
    /**
     * Root template files:
     * Where input/output string is identical value (i.e. no name/location change on copy step)
     * @type {Array} of strings
     */
    root: [".editorconfig", ".gitattributes", ".gitignore"],

    /**
     * Template files to copy over:
     * Files that need no parsing, where input & output locations differ or file name changes
     * @type {Array} of objects, e.g.
     * {input: "SOURCE_TEMPLATE_FILE", output:"DESTINATION_TEMPLATE_FILE"}
     */
    toCopy: [],

    /**
     * Template files that need parsing with generator-captured data
     * @type {Array}
     */
    toParse: [
        {
            input: "_package.json",
            output: "package.json"
        }
    ]
};

module.exports = files;
