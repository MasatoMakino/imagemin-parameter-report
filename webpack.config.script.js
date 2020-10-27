"use strict";
const webpack = require("webpack");

module.exports = (env, argv) => {
  const config = {
    entry: {
      main: "./src/js/main.js",
    },
    output: {
      path: `${__dirname}/dist/js`,
      filename: "[name].js",
    },
    resolve: {
      extensions: [".js", ".webpack.js", ".web.js", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    plugins: [new webpack.ProvidePlugin({})],
  };
  return config;
};
