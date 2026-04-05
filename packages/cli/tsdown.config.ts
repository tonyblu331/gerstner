import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'index.ts',
    cli: 'cli.ts',
  },
  platform: 'node',
  format: ['esm'],
  clean: true,
  dts: true,
})
