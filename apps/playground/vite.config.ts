import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'node:module'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const dialkitDist = join(dirname(require.resolve('dialkit')), 'styles.css')

// Resolve gerstner source via workspace — package.json exports doesn't expose itself
const __dirname = dirname(fileURLToPath(import.meta.url))
const gerstnerSrc = resolve(__dirname, '../../packages/gerstner/src')

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    conditions: ['development'],
    alias: {
      'dialkit/styles.css': dialkitDist,
      // Force all gerstner imports to source for HMR — no dist rebuild needed
      'gerstner/tw4': join(gerstnerSrc, 'tw4/index.css'),
      'gerstner/debug/debug.css': join(gerstnerSrc, 'debug/debug.css'),
      'gerstner/debug/observer': join(gerstnerSrc, 'debug/observer.ts'),
      'gerstner/debug/labels.json': join(gerstnerSrc, 'debug/labels.json'),
      'gerstner/debug': join(gerstnerSrc, 'debug/index.tsx'),
      'gerstner/stride': join(gerstnerSrc, 'stride/index.css'),
      'gerstner/css': join(gerstnerSrc, 'css/index.css'),
      'gerstner/layout': join(gerstnerSrc, 'css/layout-only.css'),
      gerstner: join(gerstnerSrc, 'css/index.css'),
    },
  },
})
