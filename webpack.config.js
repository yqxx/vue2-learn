const path = require("path");

module.exports = {
  entry: "./src/entries/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: "./dist",
  },
};
