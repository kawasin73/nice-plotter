'use strict';

var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.base.config.js');
var update = require('react-addons-update');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

config = update(config, {
  mode: { $set: 'development' },

  entry: { $set: ['babel-polyfill', './src/entry/index.jsx'] },

  devtool: { $set: 'eval-source-map' },

  output: {
    $set: {
      path: path.resolve(__dirname, 'public'),
      pathinfo: true,
      publicPath: 'http://localhost:3456/',
      filename: 'main.js'
    }
  },

  plugins: {
    $push: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        inject: true,
        filename: 'index.html',
        template: 'src/views/index.html'
      }),
      new HtmlWebpackHarddiskPlugin()
    ]
  },

  devServer: {
    $set: {
      publicPath: '/',
      host: "0.0.0.0",
      port: 3456,
      contentBase: path.join(__dirname, "./public"),
      inline: true,
      hot: true,
      stats: {
        colors: true
      },
      historyApiFallback: true
    }
  }
});

module.exports = config;
