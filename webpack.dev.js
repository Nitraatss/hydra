/* eslint-disable */
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

const DIST_DIR = __dirname + '/dist';

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: DIST_DIR,
    hot: true,
    port: 9000,
    historyApiFallback: true,
    compress: true,
    disableHostCheck: true,
  },
  output: {
    filename: '[name].bundle.[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
