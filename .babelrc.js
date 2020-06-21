const ENV = require("./app/config/env-config");

module.exports = {
    presets: ["@babel/preset-env"],
    plugins: [
        "inline-json-import",
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