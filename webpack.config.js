import { resolve } from 'path';

export const entry = './src/index.ts';
export const mode = 'production';
export const output = {
  path: resolve(import.meta.dirname, 'dist'),
  filename: 'file.bundle.js',
};
