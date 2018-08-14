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
          loader: "babel-loader",
          options: {
            presets: [
              // env を指定することで、ES2018 を ES5 に変換。
              // {modules: false}にしないと import 文が Babel によって CommonJS に変換され、
              // webpack の Tree Shaking 機能が使えない
              ["env", { modules: false }]
            ]
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
