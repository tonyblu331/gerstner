import { defineConfig } from 'vite-plus'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli.ts')
      },
      name: 'GerstnerCLI',
      fileName: (format, entryName) => `${entryName}.js`
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
