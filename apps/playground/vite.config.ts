import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolve gerstner source via workspace — package.json exports doesn't expose itself
const __dirname = dirname(fileURLToPath(import.meta.url))
const gerstnerSrc = resolve(__dirname, '../../packages/gerstner/src')
const debugSrc = resolve(__dirname, '../../packages/debug/src')

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    conditions: ['development'],
    alias: {
      // Force all gerstner imports to source for HMR — no dist rebuild needed
      'gerstner/tw4': join(gerstnerSrc, 'tw4/index.css'),
      'gerstner/stride/snapshot': join(gerstnerSrc, 'stride/snapshot.ts'),
      'gerstner/stride/debugManifest': join(gerstnerSrc, 'stride/debugManifest.ts'),
      'gerstner/stride': join(gerstnerSrc, 'stride/index.css'),
      'gerstner/css': join(gerstnerSrc, 'css/index.css'),
      'gerstner/layout': join(gerstnerSrc, 'css/layout-only.css'),
      gerstner: join(gerstnerSrc, 'css/index.css'),
      '@gerstner/debug/debug.css': join(debugSrc, 'debug.css'),
      '@gerstner/debug/observer': join(debugSrc, 'observer.ts'),
      '@gerstner/debug/labels.json': join(debugSrc, 'labels.json'),
      '@gerstner/debug': join(debugSrc, 'index.ts'),
    },
  },
})
