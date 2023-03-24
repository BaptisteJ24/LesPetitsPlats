const path = require("path");
const glob = require("glob");

module.exports = {
    entry: glob.sync("./scripts/**/*.js"),
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        ]
    }
};

