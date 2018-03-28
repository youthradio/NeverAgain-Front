const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "index.html",
  inject: "body"
});

module.exports = merge(common, {
 devtool: 'inline-source-map',
 devServer: {
   contentBase: './dist',
   watchContentBase: true
 },
 module: {
   rules: [
     {
       test: /\.css$/,
       use: [
         "style-loader",
         "css-loader?-url"]
     },
   ]
 },
 plugins: [
   HtmlWebpackPluginConfig,
 ]
});
