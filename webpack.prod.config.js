'use strict';

var path = require('path');
var update = require('react-addons-update');
var webpack = require('webpack');
var config = require('./webpack.base.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var CleanWebpackPlugin = require('clean-webpack-plugin');

var PUBLIC_PATH = path.resolve(__dirname, 'public');

config = update(config, {
  bail: { $set: true },

  entry: { $set: ['babel-polyfill', './src/entry/index.js'] },

  mode: { $set: 'production' },

  profile: { $set: false },

  devtool: { $set: '#source-map' },

  output: {
    $set: {
      path: PUBLIC_PATH,
      publicPath: '/',
      filename: 'bundle.[hash].min.js'
    }
  },

  plugins: {
    $push: [
      new CleanWebpackPlugin([PUBLIC_PATH]),
      new HtmlWebpackPlugin({
        inject: true,
        filename: 'index.html',
        template: 'src/views/index.html'
      })
    ]
  }
});

module.exports = config;
