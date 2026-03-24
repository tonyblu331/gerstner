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

  run: {
    tasks: {
      verify: {
        command: 'vp check',
        env: ['CI'],
      },
      'pack:debug': {
        command: 'cd packages/debug && vp pack',
        dependsOn: ['verify'],
      },
      'pack:cli': {
        command: 'cd packages/cli && vp pack',
        dependsOn: ['verify'],
      },
      'build:playground': {
        command: 'cd apps/playground && vp build',
        dependsOn: ['verify'],
      },
      'test:playwright': {
        command: 'npx playwright test',
        cache: false,
        dependsOn: ['build:playground'],
      },
    },
  },
})
