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
    checkedStateMap: {},
    localSearch: {
      active: false,
      countMap: {},
    },
    showCount: false,
    showCountOf: 'ALL_CHILDREN',
    showCountOnSearchComputed: false,
    noChildrenText: 'No sub-options.',
    loadingText: 'Loading...',
    retryTitle: 'Click to retry',
    retryText: 'Retry?',
    shouldFlattenOptions: false,
    shouldExpand: vi.fn(),
    shouldShowOptionInMenu: vi.fn(() => true),
    setCurrentHighlightedOption: vi.fn(),
    removeLastValue: vi.fn(),
    disabled: false,
    searchable: true,
    placeholder: 'Select...',
    clearable: true,
    allowClearingDisabled: false,
    clearAllText: 'Clear all',
    clearValueText: 'Clear value',
    alwaysOpen: false,
    openOnFocus: false,
    autoFocus: false,
    tabIndex: 0,
    backspaceRemoves: true,
    deleteRemoves: true,
    limit: Infinity,
    limitText: vi.fn(),
    valueFormat: 'id',
    delimiter: ',',
    openMenu: vi.fn(),
    closeMenu: vi.fn(),
    clear: vi.fn(),
    focusInput: vi.fn(),
    blurInput: vi.fn(),
    getSelectedNodes: vi.fn(() => []),
    getNode: vi.fn(() => null),
    isSelected: vi.fn(() => false),
    toggleExpanded: vi.fn(),
    select: vi.fn(),
    loadChildrenOptions: vi.fn(),
    getInstanceId: vi.fn(() => 'test'),
    getValue: vi.fn(),
    initialize: vi.fn(),
    buildForestState: vi.fn(),
    shouldOptionBeIncludedInSearchResult: vi.fn(() => false),
    traverseAllNodesByIndex: vi.fn(),
    extractCheckedNodeIdsFromValue: vi.fn(() => []),
    fixSelectedNodeIds: vi.fn(),
    enhancedNormalizer: vi.fn((o) => o),
    toggleMenu: vi.fn(),
    resetHighlightedOptionWhenNecessary: vi.fn(),
    highlightFirstOption: vi.fn(),
    highlightPrevOption: vi.fn(),
    highlightNextOption: vi.fn(),
    highlightLastOption: vi.fn(),
    visibleOptionIds: [],
    setMenuGetter: vi.fn(),
    setControlGetter: vi.fn(),
    setInputGetter: vi.fn(),
    handleLocalSearch: vi.fn(),
    handleRemoteSearch: vi.fn(),
    resetSearchQuery: vi.fn(),
    loadRootOptions: vi.fn(),
    callLoadOptionsProp: vi.fn(),
    handleMouseDown: vi.fn(),
    setup: vi.fn(),
    onMount: vi.fn(),
    onUnmount: vi.fn(),
    forest: {
      normalizedOptions: [],
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
