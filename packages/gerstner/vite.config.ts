import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    dts: true,
    format: ['esm'],
    sourcemap: true,
    entry: ['src/cli/cli.ts'],
  },
})
