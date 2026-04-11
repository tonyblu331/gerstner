import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'node:module'
import { join, dirname } from 'node:path'

const require = createRequire(import.meta.url)
const dialkitDist = join(dirname(require.resolve('dialkit')), 'styles.css')

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      'dialkit/styles.css': dialkitDist,
    },
  },
})
