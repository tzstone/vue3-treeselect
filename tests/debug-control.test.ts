import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { provide, computed } from 'vue'
import Control from '../src/components/Control.vue'
import type { TreeselectInstance } from '../src/types'
import { TRESELECT_INSTANCE_KEY } from '../src/types'

function createMockInstance(overrides: Partial<TreeselectInstance> = {}): TreeselectInstance {
  return {
    trigger: {
      isFocused: false,
      searchQuery: '',
    },
    menuIsOpen: false,
    currentHighlightedOptionId: null,
    selectedNodes: [],
    hasValue: false,
    single: true,
    multiple: false,
    hasBranchNodes: false,
    localSearch: {
      active: false,
      noResults: true,
      countMap: {},
    },
    forest: {
      normalizedOptions: [],
      nodeMap: {},
      checkedStateMap: {},
      selectedNodeIds: [],
      selectedNodeMap: {},
    },
    rootOptionsStates: {
      isLoaded: false,
      isLoading: false,
      loadingError: '',
    },
    remoteSearch: {},
    noOptionsText: 'No options available.',
    noResultsText: 'No results found.',
    searchPromptText: 'Type to search...',
    getRemoteSearchEntry: vi.fn(() => ({ isLoaded: false, isLoading: false, loadingError: '', options: [] })),
    openDirection: 'auto',
    getMenu: vi.fn(() => null),
    getControl: vi.fn(() => null),
    menu: {
      isOpen: false,
      current: null,
      lastScrollPosition: 0,
      placement: 'bottom',
    },
    getValueContainer: vi.fn(() => null),
    setValueContainerGetter: vi.fn(),
    setupHandleClickOutside: vi.fn(),
    ...overrides,
  }
}

describe('Task 8: Control component debugging', () => {
  it('should mount without errors', async () => {
    const mockInstance = createMockInstance()

    const TestWrapper = {
      template: '<Control />',
      components: { Control },
      setup() {
        provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
        return {}
      },
    }

    const wrapper = mount(TestWrapper)
    expect(wrapper.exists()).toBe(true)
    console.log('Wrapper HTML:', wrapper.html())
  })
})
