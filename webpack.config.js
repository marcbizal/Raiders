var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

const config = {
  entry: './src/main.js',
  output: {
    path: __dirname,
    filename: 'app.bundle.js' 
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader', // backup loader when not building .css file
          loader: 'css-loader!sass-loader' // loaders to preprocess CSS
        })
      }
    ]
  }
};

module.exports = config;