const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
 devtool: 'inline-source-map',
 devServer: {
   contentBase: './dist'
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
 }
});
