import { vi } from 'vitest'

// Mock SCSS imports
vi.mock('../src/styles/index.scss', () => ({}))

// Mock child components that don't exist yet
vi.mock('../src/components/HiddenFields.vue', () => ({
  default: {
    name: 'HiddenFields',
    template: '<div class="hidden-fields"></div>',
  },
}))

vi.mock('../src/components/Control.vue', () => ({
  default: {
    name: 'Control',
    template: '<div class="control"></div>',
  },
}))

vi.mock('../src/components/Menu.vue', () => ({
  default: {
    name: 'Menu',
    template: '<div class="menu"></div>',
  },
}))

vi.mock('../src/components/MenuPortal.vue', () => ({
  default: {
    name: 'MenuPortal',
    template: '<div class="menu-portal"></div>',
  },
}))
