const path = require("path");

const prompts = [
    {
        type: "input",
        name: "appname",
        message: "What is the project name?",
        default: path.basename(process.cwd()),
        validate: (str) => {
            return str.trim().length > 0;
        }
    }
    // @TODO: Add description & version number
];

module.exports = prompts;
