import { defineConfig } from 'vite-plus'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GerstnerDebug',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vite-plus'],
      output: {
        globals: {
          'vite-plus': 'VitePlus'
        }
      }
    }
  }
})
