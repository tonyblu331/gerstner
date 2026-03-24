import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts'
  },
  platform: 'node',
  format: ['esm'],
  clean: true,
  dts: true,
})
