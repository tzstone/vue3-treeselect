import { vi } from 'vitest'

// Mock SCSS imports
vi.mock('../src/styles/index.scss', () => ({}))

// Mock child components that don't exist yet
vi.mock('../src/components/HiddenFields.vue', () => ({
  default: {
    name: 'HiddenFields',
    template: '<div class="vue-treeselect__hidden-field"></div>',
  },
}))

vi.mock('../src/components/Menu.vue', () => ({
  default: {
    name: 'Menu',
    template: '<div class="vue-treeselect__menu"></div>',
  },
}))

vi.mock('../src/components/MenuPortal.vue', () => ({
  default: {
    name: 'MenuPortal',
    template: '<div class="vue-treeselect__menu-portal"></div>',
  },
}))

// Control, Placeholder, SingleValue, MultiValue, and Input are not mocked
// to test actual DOM rendering behavior
