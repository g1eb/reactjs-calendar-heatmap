import { babel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: {
    format: 'es',
    dir: 'dist/esm',
  },
  plugins: [
    babel({
      babelHelpers: 'bundled', // https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
      presets: ['@babel/env', '@babel/preset-react'],
    }),
    postcss(),
  ],
  external: ['moment', 'd3', 'react'],
};