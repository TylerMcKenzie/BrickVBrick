var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var PHASER_DIR = path.join(__dirname, '/node_modules/phaser/');
var APP_DIR = path.join(__dirname, 'app');

module.exports = {
  context: APP_DIR,
  devtool: 'eval',
  entry: {
    app: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client?reload=true',
      './js/app.js',
      './scss/app.scss'
    ],
    game: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client?reload=true',
      './js/game/game.js'
    ],
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    filename: '[name].js',
    path: '/',
    publicPath: "http://localhost:3000/"
  },
  resolve: {
    alias: {
      phaser: path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
      pixi: path.join(PHASER_DIR, 'build/custom/pixi.js'),
      p2: path.join(PHASER_DIR, 'build/custom/p2.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        include: APP_DIR
      },
      {
        test: /.scss$/,
        use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /pixi\.js/,
        use: [{
          loader: 'expose-loader',
          options: 'PIXI',
        }],
      },
      {
        test: /phaser-split\.js$/,
        use: [{
          loader: 'expose-loader',
          options: 'Phaser',
        }],
      },
      {
        test: /p2\.js/,
        use: [{
          loader: 'expose-loader',
          options: 'p2',
        }],
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    })
  ],
  target: 'web'
}
