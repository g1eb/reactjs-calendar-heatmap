const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',

  optimization: {
    minimize: false,
  },

  entry: {
    'calendar-heatmap': './src/index.ts',
    'calendar-heatmap.min': './src/index.ts',
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
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
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: { compilerOptions: { jsx: 'react-jsx' } },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/types.d.ts', to: './' }],
    }),
  ],
};
