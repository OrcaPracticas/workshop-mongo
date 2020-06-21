const ENV = require("./app/config/env-config");

module.exports = {
    presets: ["@babel/preset-env"],
    plugins: [
        "inline-json-import",
        "@babel/plugin-proposal-class-properties",
        [
            "module-resolver",
            {
                alias: {
                    "Controller": "./app/src/controller/",
                    "Models": "./app/src/models/",
                    "Tools": "./app/src/tools/",
                }
            }
        ],
        [
            "transform-define",
            { ...ENV },
        ],
    ],
};