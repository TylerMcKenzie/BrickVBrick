var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, 'app'),
  devtool: 'source-map',
  entry: {
    app: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      './js/app.js'
    ],
    vendor: [
      'react'
    ]
  },
  output: {
    filename: 'app.bundle.js',
    path: '/',
    publicPath: "http://localhost:3000/public/"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ],
  target: 'web'
}
