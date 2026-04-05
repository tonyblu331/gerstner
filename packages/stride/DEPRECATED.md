# packages/stride (Legacy / Internal)

**This directory is deprecated.**

The contents have been consolidated into `packages/gerstner/` as part of Phase 3.

## New Package Structure

```
packages/gerstner/
  src/css/     → CSS surface (was packages/stride/*.css)
  src/tw4/     → Tailwind v4 surface (new)
  src/cli/     → CLI (was packages/cli/)
  src/debug/   → Debug tools (was packages/debug/)
  src/stride/  → Internal math engine
```

## Migration Guide

| Old Import | New Import |
|------------|------------|
| `@import 'gerstner';` | `@import 'gerstner/css';` |
| `@import 'gerstner/layout';` | `@import 'gerstner/css';` |
| `import { initGerstnerDebug } from '@gerstner/debug'` | `import { initGerstnerDebug } from 'gerstner/debug'` |
| `npx @gerstner/cli init` | `npx gerstner init` |

## Removal

This directory will be deleted in a future cleanup pass.
