import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/esm/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [nodeResolve(), commonjs(), typescript()],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
};
