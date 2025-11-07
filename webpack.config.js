import { resolve } from 'path';
import { URL, fileURLToPath } from 'url';

export default {
  entry: './src/index.ts',
  target: 'node',
  mode: process.env.NODE_ENV || 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'bundle.js',
    path: resolve(import.meta.dirname, 'dist'),
  },
};
