# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-11
**Commit:** 670116b
**Branch:** (current)

## OVERVIEW
Vue 3 multi-select tree component with nested options support. Library exports single Treeselect component + full TypeScript types. Peer dep: Vue ^3.5.0.

## STRUCTURE
```
vue3-treeselect/
├── src/
│   ├── components/   # 15 Vue components (icons/ nested)
│   ├── composables/   # 5 composables (orchestrator pattern)
│   ├── utils/         # 20 utility functions (barrel export)
│   ├── types/         # TypeScript definitions
│   ├── styles/        # SCSS partials
│   └── index.ts       # Main export
├── demo/              # Demo app
├── tests/             # Vitest tests (14 files)
└── dist/              # Build output
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add component | `src/components/` | Use provide/inject pattern |
| Add utility | `src/utils/` | Add to barrel export |
| Add type | `src/types/treeselect.ts` | 632-line type file |
| Fix logic | `src/composables/useForest.ts` | 721 lines - tree logic |
| Add prop | `src/types/treeselect.ts` | TreeselectProps interface |
| Write test | `tests/` | Use createMockInstance helper |

## CODE MAP
| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| Treeselect | Component | src/components/Treeselect.vue | 1 | Root component |
| useTreeselect | Composable | src/composables/useTreeselect.ts | 1 | Orchestrator |
| useForest | Composable | src/composables/useForest.ts | 1 | Tree data |
| TreeselectProps | Interface | src/types/treeselect.ts | 3 | 50+ props |
| TreeselectInstance | Interface | src/types/treeselect.ts | 5 | Full API |

## CONVENTIONS
- **2-space indent** (no tabs)
- **LF line endings**
- **Underscore prefix** for internal vars: `_emit`, `_internalValue`
- **Single-word components allowed** (vue/multi-word-component-names OFF)
- **Unused params** with `_` prefix allowed
- **`any` type** triggers WARNING not ERROR

## ANTI-PATTERNS (THIS PROJECT)
- Duplicate node IDs → warning at runtime
- `isBranch: true` deprecated → use `children: null`
- Branch node + no loadOptions → warning
- async mode + searchable=false → warning
- flat mode + multiple=false → warning

## UNIQUE STYLES
- **Orchestrator pattern**: useTreeselect coordinates 4 sub-composables
- **Shallow structure**: max depth 2 (only icons/ is depth 2)
- **Barrel exports**: index.ts in utils/, types/
- **No composables barrel**: internal only
- **No README.md**: Missing documentation

## COMMANDS
```bash
npm run dev          # Demo server
npm run build        # Type check + build
npm run test         # Vitest run
npm run test:watch   # Watch mode
npm run lint         # ESLint
npm run type-check   # vue-tsc
```

## NOTES
- No GitHub Actions CI/CD
- Dual vitest configs: vitest.config.ts, vitest.config.treeselect.ts
- Sisyphus automation in .sisyphus/
- 3 files >500 lines: useForest.ts (721), treeselect.ts (632), useTreeselect.ts (565)
- 8 large files (>500 lines) total in codebase