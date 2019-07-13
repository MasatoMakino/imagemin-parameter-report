"use strict";
const path = require("path");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const config = {
    entry: {
      main: "./src/js/main.js"
    },
    output: {
      path: `${__dirname}/dist/js`,
      filename: "[name].js"
    },
    resolve: {
      extensions: [".js", ".webpack.js", ".web.js", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        // $: "jquery",
        // jQuery: "jquery",
        // "window.jQuery": "jquery",
      })
    ],
    devtool: argv.mode === "production" ? "" : "inline-source-map"
  };
  return config;
};
