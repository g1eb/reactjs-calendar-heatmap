var webpack = require('webpack');
var path = require('path');

module.exports = {

  mode: 'production',

  optimization: {
    minimize: false,
  },

  entry: {
    'calendar-heatmap': './src/index.js',
    'calendar-heatmap.min': './src/index.js',
  },

  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react'
    },
    'moment': 'moment',
    'd3': 'd3',
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'CalendarHeatmap',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react'],
            plugins: ['add-module-exports'],
          },
        },
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

};
