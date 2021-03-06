const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const ReactDataModels = require('../models').react;

const config = require('../config');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './app/index.html',
  filename: './index.html',
});

module.exports = {
  entry: {
    index: './app/index.jsx',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'app'), '../node_modules'],
    extensions: ['.js', '.jsx'],
  },
  devtool: 'inline-source-map',
  devServer: {
    stats: 'minimal',
    historyApiFallback: true,
    proxy: {
      '/api/**': `http://localhost:${config.serverPort}`,
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    htmlPlugin,
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
    ]),
    new webpack.ProvidePlugin({
      Models: ReactDataModels,
    }),
    new WebpackNotifierPlugin({ excludeWarnings: true }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'src')],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },
};
