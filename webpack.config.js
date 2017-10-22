var webpack = require('webpack');
var path = require('path');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {

  entry: {
    'calendar-heatmap': './src/index.js',
    'calendar-heatmap.min': './src/index.js'
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'moment': 'moment',
    'd3': 'd3'
  },

  output: {
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'CalendarHeatmap'
  },

  plugins: [
    new UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ],

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }

};
