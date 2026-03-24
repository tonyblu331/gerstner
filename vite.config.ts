import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    singleQuote: true,
    semi: false,
  },

  lint: {
    ignorePatterns: [
      '**/dist/**',
      '**/coverage/**',
      '**/.vite/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },

  staged: {
    '*.{js,ts,tsx,jsx,cjs,mjs,css,md,json,yml,yaml}': 'vp check --fix',
  },
})
