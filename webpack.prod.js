const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require('./webpack.common.js');


const extractCSS = new MiniCssExtractPlugin({
  disable: process.env.NODE_ENV === "development",
  filename: "[name].css",
  chunkFilename: "[id].css"
});

module.exports = merge(common, {
 devtool: 'source-map',
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
   extractCSS,
   new UglifyJSPlugin({
      sourceMap: true
   }),
   new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
   })
 ]
});
