const files = {
    // Root files: where input/output is same string value
    root: [".editorconfig", ".gitattributes", ".gitignore"],

    // Files that need parsing with generator-captured data
    // before being copying over
    toParse: [
        {
            input: "_package.json",
            output: "package.json"
        }
    ]
};

module.exports = files;
