const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanPack = new CleanWebpackPlugin(['dist']);


const copyAssets = new CopyWebpackPlugin([{
  from: 'src/assets',
  to: 'assets'
}]);

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [{
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: ['file-loader']
      // },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: "babel-loader",
          options: {
            presets: ["es2015"]
          }
        }]
      }
    ]
  },
  plugins: [
    CleanPack,
    copyAssets
  ]
};
