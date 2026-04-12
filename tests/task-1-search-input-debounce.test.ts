import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, provide } from 'vue'
import Input from '../src/components/Input.vue'
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

describe('Task 1: Search Input Debounce Fix', () => {
  describe('Scenario 1: searchQuery updates immediately (no delay)', () => {
    it('should update searchQuery immediately when typing', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          const instanceRef = computed(() => mockInstance)
          provide(TRESELECT_INSTANCE_KEY, instanceRef)
          return {}
        },
      }

      const wrapper = mount(TestWrapper)
      const input = wrapper.find('.vue-treeselect__input')

      await input.setValue('test')

      expect(mockInstance.trigger.searchQuery).toBe('test')
    })

    it('should update searchQuery immediately on first keystroke', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          const instanceRef = computed(() => mockInstance)
          provide(TRESELECT_INSTANCE_KEY, instanceRef)
          return {}
        },
      }

      const wrapper = mount(TestWrapper)
      const input = wrapper.find('.vue-treeselect__input')

      await input.setValue('a')

      expect(mockInstance.trigger.searchQuery).toBe('a')
    })

    it('should update searchQuery immediately on each keystroke', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          const instanceRef = computed(() => mockInstance)
          provide(TRESELECT_INSTANCE_KEY, instanceRef)
          return {}
        },
      }

      const wrapper = mount(TestWrapper)
      const input = wrapper.find('.vue-treeselect__input')

      await input.setValue('a')
      expect(mockInstance.trigger.searchQuery).toBe('a')

      await input.setValue('ab')
      expect(mockInstance.trigger.searchQuery).toBe('ab')

      await input.setValue('abc')
      expect(mockInstance.trigger.searchQuery).toBe('abc')
    })
  })

  describe('Scenario 3: Clear search immediately (no debounce)', () => {
    it('should clear searchQuery immediately when input is emptied', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          const instanceRef = computed(() => mockInstance)
          provide(TRESELECT_INSTANCE_KEY, instanceRef)
          return {}
        },
      }

      const wrapper = mount(TestWrapper)
      const input = wrapper.find('.vue-treeselect__input')

      await input.setValue('test')
      expect(mockInstance.trigger.searchQuery).toBe('test')

      await input.setValue('')

      expect(mockInstance.trigger.searchQuery).toBe('')
    })
  })
})
