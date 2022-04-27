import { babel } from '@rollup/plugin-babel';
import css from 'rollup-plugin-import-css';

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
    css(),
  ],
  external: ['moment', 'd3', 'react'],
};
