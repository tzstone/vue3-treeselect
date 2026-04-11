# UTILITIES KNOWLEDGE BASE

**Generated:** 2026-04-11
**Commit:** 670116b
**Branch:** (current)

## OVERVIEW
20 cross-cutting utility functions exported via barrel index.ts, organized into 4 functional groups.

## STRUCTURE
```
src/utils/
├── Debugging Helpers     # warning
├── DOM Utilities         # debounce, scrollIntoView, watchSize, onLeftClick
├── Language Helpers      # once, noop, identity, constant, createMap, deepExtend
└── Other Utilities       # quickDiff, isNaN, isPromise
```

## WHERE TO LOOK
| Task | File | Notes |
|------|------|-------|
| Add new utility | `src/utils/[name].ts` | Export from barrel index.ts |
| DOM operations | scrollIntoView.ts, watchSize.ts | Browser APIs |
| Performance | debounce.ts, quickDiff.ts | Time complexity matters |
| Data manipulation | createMap.ts, removeFromArray.ts | Immutability patterns |

## CONVENTIONS
- **Barrel export**: All functions re-exported from index.ts with section comments
- **Single-function files**: Each utility in its own file
- **Generic types**: Use generics for type safety: last<T>, debounce<T>
- **Small footprint**: Most files under 20 lines