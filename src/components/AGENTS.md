# COMPONENTS KNOWLEDGE BASE

**Generated:** 2026-04-11
**Commit:** 670116b
**Branch:** (current)

## OVERVIEW
15 Vue components organized by function with icons subdirectory.

## STRUCTURE
```
src/components/
├── Treeselect.vue           # Root orchestrator
├── icons/                   # Arrow.vue, Delete.vue
├── Control.vue              # Click area
├── ControlSimple.vue        # Read-only display
├── Input.vue                # Search input
├── SingleValue.vue          # Selected value (single)
├── MultiValue.vue           # Value container
├── MultiValueItem.vue       # Individual tag
├── Placeholder.vue          # Empty state
├── Menu.vue                 # Dropdown list
├── MenuPortal.vue           # Teleport wrapper
├── Option.vue               # Tree node (recursive)
├── Tip.vue                  # Status messages
└── HiddenFields.vue         # Form inputs
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Modify dropdown | Menu.vue, MenuPortal.vue | MenuPortal handles teleport |
| Change selection | SingleValue.vue, MultiValueItem.vue | Tag behavior |
| Add icon | icons/ | SVG components |
| Adjust search | Input.vue | Search input component |
| Custom slots | All components | Named slots via parent |
| Expose methods | Treeselect.vue | defineExpose pattern |

## CONVENTIONS
- **Recursive rendering**: Option.vue renders itself for children
- **Slot naming**: kebab-case for consistency
- **defineExpose**: Public methods via Treeselect.vue
- **provide/inject**: TreeselectInstance passed down
- **Portal pattern**: MenuPortal uses Vue's teleport
