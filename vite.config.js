import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/bit.js'),
      name: 'binary-indexed-tree-js',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      output: {
        exports: 'named',
      }
    },
  },
  test: {
  },
})