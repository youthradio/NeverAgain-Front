const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require('./webpack.common.js');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "index.html",
  inject: "body",
  minify: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  }
});
const extractCSS = new MiniCssExtractPlugin({
  filename: "[name].css",
  chunkFilename: "[id].css"
});
const uglifyJS = new UglifyJSPlugin({
   cache: true,
   parallel: true,
   sourceMap: true
});
const defineMode = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
});
const optimizeCSS = new OptimizeCSSAssetsPlugin({});


module.exports = merge(common, {
 // devtool: 'source-map',
 optimization: {
  minimizer: [
    uglifyJS,
    optimizeCSS
  ]
 },
 module: {
   rules: [
     {
       test: /\.css$/,
       use: [
         MiniCssExtractPlugin.loader,
         "css-loader?-url"]
     },
   ]
 },
 plugins: [
   HtmlWebpackPluginConfig,
   extractCSS,
   defineMode
 ]
});
