# vue3-treeselect

A multi-select component with nested options support for Vue 3.

A Vue 3 port of [vue-treeselect](https://github.com/riophae/vue-treeselect) with **fully consistent API**.

## API Compatibility

This library maintains **100% API compatibility** with the original [vue-treeselect](https://github.com/riophae/vue-treeselect). All props, events, slots, and methods are identical in behavior and naming.

**The only difference**: Use Vue 3's standard `v-model` instead of the deprecated `value` prop.

```vue
<!-- Vue 2 (original vue-treeselect) -->
<treeselect v-model="value" :options="options" />

<!-- Vue 3 (vue3-treeselect) -->
<Treeselect v-model="value" :options="options" />
```

## Features

- Single-select and multi-select modes
- Nested options with unlimited depth
- Async loading for options and search results
- Fuzzy matching search
- Flat mode for normalized data
- Keyboard navigation
- RTL support
- Comprehensive TypeScript support

## Installation

```bash
npm install vue3-treeselect
```

## Usage

```vue
<script setup>
import { ref } from 'vue';
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';

const value = ref(null);

const options = [
  {
    id: 'fruit',
    label: 'Fruit',
    children: [
      { id: 'apple', label: 'Apple' },
      { id: 'banana', label: 'Banana' },
    ],
  },
  { id: 'vegetable', label: 'Vegetable' },
];
</script>

<template>
  <Treeselect v-model="value" :options="options" placeholder="Select..." />
</template>
```

## v-model Binding

```vue
<!-- Single select -->
<Treeselect v-model="selectedId" :options="options" />

<!-- Multiple select -->
<Treeselect v-model="selectedIds" :options="options" multiple />

<!-- Object value format -->
<Treeselect v-model="selected" :options="options" value-format="object" />
```

## Props

### Value Binding

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `String \| Number \| Object \| Array` | - | Selected value |
| `multiple` | `Boolean` | `false` | Enable multi-select mode |
| `value-format` | `'id' \| 'object'` | `'id'` | Format of the value |
| `value-consists-of` | `'ALL' \| 'BRANCH_PRIORITY' \| 'LEAF_PRIORITY' \| 'ALL_WITH_INDETERMINATE'` | `'ALL'` | Which nodes to include in value |

### Data

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array` | - | Available options |
| `load-options` | `Function` | - | Dynamically load options |
| `async` | `Boolean` | `false` | Enable async search mode |
| `cache-options` | `Boolean` | `true` | Cache search results |
| `default-options` | `Boolean \| Array` | `false` | Default options before search |
| `normalizer` | `Function` | - | Normalize source data |
| `flat` | `Boolean` | `false` | Enable flat mode |

### Behavior

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchable` | `Boolean` | `true` | Enable search |
| `clearable` | `Boolean` | `true` | Show clear button |
| `clear-on-select` | `Boolean` | `false` | Clear search after selection |
| `close-on-select` | `Boolean` | `false` | Close menu after selection |
| `always-open` | `Boolean` | `false` | Menu always open |
| `disabled` | `Boolean` | `false` | Disable control |
| `open-on-click` | `Boolean` | `true` | Open menu on click |
| `open-on-focus` | `Boolean` | `false` | Open menu on focus |

### Selection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `allow-clearing-disabled` | `Boolean` | `false` | Allow clearing when disabled |
| `allow-selecting-disabled-descendants` | `Boolean` | `false` | Select disabled descendants |
| `auto-select-ancestors` | `Boolean` | `false` | Auto select ancestors (flat mode) |
| `auto-select-descendants` | `Boolean` | `false` | Auto select descendants (flat mode) |
| `auto-deselect-ancestors` | `Boolean` | `'auto'` | Auto deselect ancestors |
| `auto-deselect-descendants` | `Boolean` | `'auto'` | Auto deselect descendants |
| `disable-branch-nodes` | `Boolean` | `false` | Prevent selecting branch nodes |
| `limit` | `Number` | `Infinity` | Max selected items |
| `limit-text` | `Function` | - | Limit text formatter |
| `sort-value-by` | `'ORDER_SELECTED' \| 'LEVEL' \| 'INDEX'` | `'ORDER_SELECTED'` | Sort order |

### Display

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `String` | `'Select...'` | Placeholder text |
| `no-options-text` | `String` | `'No options available'` | No options text |
| `no-results-text` | `String` | `'No results found...'` | No results text |
| `loading-text` | `String` | `'Loading...'` | Loading text |
| `clear-value-text` | `String` | `'Clear value'` | Clear button title |
| `clear-all-text` | `String` | `'Clear all'` | Clear all button title |
| `search-prompt-text` | `String` | `'Type to search...'` | Search prompt |
| `retry-text` | `String` | `'Retry'` | Retry button text |
| `retry-title` | `String` | `'Retry'` | Retry button title |
| `no-children-text` | `String` | `'No children'` | No children text |
| `branch-nodes-first` | `Boolean` | `false` | Show branch nodes first |
| `show-count` | `Boolean` | `false` | Show children count |
| `show-count-of` | `'ALL_CHILDREN' \| 'ALL_DESCENDANTS' \| 'LEAF_CHILDREN' \| 'LEAF_DESCENDANTS'` | `'ALL_CHILDREN'` | Count type |
| `show-count-on-search` | `Boolean \| null` | `null` | Show count in search |
| `default-expand-level` | `Number` | `0` | Auto expand level |
| `max-height` | `Number` | `300` | Menu max height |
| `open-direction` | `'auto' \| 'top' \| 'bottom' \| 'above' \| 'below'` | `'auto'` | Open direction |
| `z-index` | `Number \| String` | `1` | Menu z-index |
| `append-to-body` | `Boolean` | `false` | Append menu to body |

### Search

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `search-nested` | `Boolean` | `false` | Search in ancestors |
| `flatten-search-results` | `Boolean` | `false` | Flatten search results |
| `disable-fuzzy-matching` | `Boolean` | `false` | Disable fuzzy matching |
| `match-keys` | `String[]` | `['label']` | Search fields |

### Keyboard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tab-index` | `Number` | `0` | Tab index |
| `backspace-removes` | `Boolean` | `true` | Backspace removes item |
| `delete-removes` | `Boolean` | `true` | Delete key removes item |

### Other

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `auto-focus` | `Boolean` | `false` | Auto focus on mount |
| `auto-load-root-options` | `Boolean` | `true` | Auto load root options |
| `instance-id` | `String \| Number` | - | Instance identifier |
| `join-values` | `Boolean` | `false` | Join values with delimiter |
| `delimiter` | `String` | `','` | Value delimiter |
| `name` | `String` | - | Hidden input name |
| `required` | `Boolean` | `false` | HTML5 required |

## Events

| Event | Arguments | Description |
|-------|-----------|-------------|
| `update:modelValue` | `(value, instanceId)` | Emitted when value changes |
| `select` | `(node, instanceId)` | Emitted when option is selected |
| `deselect` | `(node, instanceId)` | Emitted when option is deselected |
| `search-change` | `(query, instanceId)` | Emitted when search query changes |
| `open` | `(instanceId)` | Emitted when menu opens |
| `close` | `(value, instanceId)` | Emitted when menu closes |

## Slots

| Slot | Props | Description |
|------|-------|-------------|
| `option-label` | `{ node, shouldShowCount, count, labelClassName, countClassName }` | Custom option label |
| `value-label` | `{ node }` | Custom value label |
| `before-list` | - | Content before option list |
| `after-list` | - | Content after option list |

## Methods

| Method | Description |
|--------|-------------|
| `openMenu()` | Open the dropdown menu |
| `closeMenu()` | Close the dropdown menu |
| `toggleMenu()` | Toggle menu open/close |
| `clear()` | Clear selected value |
| `focusInput()` | Focus the input |
| `blurInput()` | Blur the input |
| `getSelectedNodes()` | Get selected node objects |
| `getNode(id)` | Get node by ID |
| `isSelected(node)` | Check if node is selected |
| `toggleExpanded(node)` | Toggle node expanded state |
| `select(node)` | Programmatically select a node |
| `loadChildrenOptions(node)` | Load children for a node |

## Async Loading

```vue
<script setup>
import { ref, watch } from 'vue';
import Treeselect from 'vue3-treeselect';

const value = ref(null);
const options = ref([]);

const loadOptions = ({ action, parentNode, callback }) => {
  if (action === 'LOAD_CHILDREN_OPTIONS') {
    // Simulate API call
    setTimeout(() => {
      callback(null, {
        children: [
          { id: `${parentNode.id}-1`, label: `Child of ${parentNode.label}` },
        ],
      });
    }, 500);
  }
};
</script>

<template>
  <Treeselect
    v-model="value"
    :options="options"
    :load-options="loadOptions"
    :async="true"
    placeholder="Async loading..."
  />
</template>
```

## License

MIT
