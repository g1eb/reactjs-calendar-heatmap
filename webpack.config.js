var path = require('path');
module.exports = {
  entry: './src/calendar-heatmap.component.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'calendar-heatmap.min.js',
    library: 'Example',
    libraryTarget: 'umd2',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  externals: {
    'react': 'React',
  }
};
