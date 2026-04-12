import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp, h, provide, InjectionKey, ref, computed } from 'vue'
import Treeselect from '../src/components/Treeselect.vue'
import Control from '../src/components/Control.vue'
import Placeholder from '../src/components/Placeholder.vue'
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
    internalValue: [],
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

describe('Task 8: Control + Placeholder + Input Components', () => {
  describe('Control component', () => {
    it('should render correctly in single mode', async () => {
      const mockInstance = createMockInstance({
        single: true,
        multiple: false,
        hasValue: false,
      })

      const wrapper = mount(Control, {
        global: {
          provide: {
            [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
          },
        },
      })

      expect(wrapper.find('.vue-treeselect__control').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__input').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__x-container').exists()).toBe(false)
    })

    it('should render correctly in multi mode', async () => {
      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: false,
      })

      const wrapper = mount(Control, {
        global: {
          provide: {
            [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
          },
        },
      })

      expect(wrapper.find('.vue-treeselect__control').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(false)
    })

    it('should show X button when clearable and hasValue', async () => {
      const mockInstance = createMockInstance({
        single: true,
        multiple: false,
        hasValue: true,
        selectedNodes: [
          { id: '1', label: 'Option 1', isDisabled: false } as any,
        ],
      })

      const wrapper = mount(Control, {
        global: {
          provide: {
            [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
          },
        },
      })

      expect(wrapper.find('.vue-treeselect__x-container').exists()).toBe(true)
    })

    it('should show arrow button', async () => {
      const mockInstance = createMockInstance({
        single: true,
        multiple: false,
        menuIsOpen: false,
      })

      const wrapper = mount(Control, {
        global: {
          provide: {
            [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
          },
        },
      })

      expect(wrapper.find('.vue-treeselect__control-arrow-container').exists()).toBe(true)
    })

    it('should rotate arrow when menu is open', async () => {
      const mockInstance = createMockInstance({
        single: true,
        multiple: false,
        menuIsOpen: true,
      })

      const wrapper = mount(Control, {
        global: {
          provide: {
            [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
          },
        },
      })

      const arrow = wrapper.find('.vue-treeselect__control-arrow')
      expect(arrow.exists()).toBe(true)
      expect(arrow.classes()).toContain('vue-treeselect__control-arrow--rotated')
    })
  })

  describe('Placeholder component', () => {
    it('should render placeholder text', async () => {
      const mockInstance = createMockInstance({
        placeholder: 'Select an option...',
        hasValue: false,
        trigger: { isFocused: false, searchQuery: '' },
      })

      const TestWrapper = {
        template: '<Placeholder />',
        components: { Placeholder },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.exists()).toBe(true)
      expect(placeholder.text()).toBe('Select an option...')
    })

    it('should be hidden when hasValue is true', async () => {
      const mockInstance = createMockInstance({
        placeholder: 'Select an option...',
        hasValue: true,
        trigger: { isFocused: false, searchQuery: '' },
      })

      const TestWrapper = {
        template: '<Placeholder />',
        components: { Placeholder },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.classes()).toContain('vue-treeselect-helper-hide')
    })

    it('should be hidden when searchQuery is not empty', async () => {
      const mockInstance = createMockInstance({
        placeholder: 'Select an option...',
        hasValue: false,
        trigger: { isFocused: false, searchQuery: 'test' },
      })

      const TestWrapper = {
        template: '<Placeholder />',
        components: { Placeholder },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.classes()).toContain('vue-treeselect-helper-hide')
    })
  })

  describe('Input component', () => {
    it('should render input when searchable and menuIsOpen', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(true)
    })

    it('should not render input when not searchable', async () => {
      const mockInstance = createMockInstance({
        searchable: false,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(false)
    })

    it('should not render input when disabled', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: true,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(false)
    })

    it('should handle input events with debouncing', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.setValue('test')

      await new Promise(resolve => setTimeout(resolve, 250))

      expect(mockInstance.trigger.searchQuery).toBe('test')
    })

    it('should handle keyboard events - BACKSPACE removes last value', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        multiple: true,
        backspaceRemoves: true,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.setValue('')
      await input.trigger('keydown', { keyCode: 8 })

      expect(mockInstance.removeLastValue).toHaveBeenCalled()
    })

    it('should handle keyboard events - ENTER selects option', async () => {
      const mockNode = { id: '1', label: 'Option 1', isBranch: false, isLeaf: true } as any
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
        currentHighlightedOptionId: '1',
        getNode: vi.fn(() => mockNode),
        select: vi.fn(),
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.trigger('keydown', { keyCode: 13 })

      expect(mockInstance.select).toHaveBeenCalledWith(mockNode)
    })

    it('should handle keyboard events - ESCAPE clears input', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.setValue('test')
      await input.trigger('keydown', { keyCode: 27 })

      expect(wrapper.find('.vue-treeselect__input').element.value).toBe('')
    })

    it('should handle keyboard events - ARROW_DOWN highlights next option', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
        highlightNextOption: vi.fn(),
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.trigger('keydown', { keyCode: 40 })

      expect(mockInstance.highlightNextOption).toHaveBeenCalled()
    })

    it('should handle keyboard events - ARROW_UP highlights previous option', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
        highlightPrevOption: vi.fn(),
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.trigger('keydown', { keyCode: 38 })

      expect(mockInstance.highlightPrevOption).toHaveBeenCalled()
    })
  })

  describe('Treeselect with Control component', () => {
    it('should mount with Control component', async () => {
      const options = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
      ]

      const wrapper = mount(Treeselect, {
        props: {
          options,
          multiple: false,
        },
      })

      expect(wrapper.find('.vue-treeselect__control').exists()).toBe(true)
    })

    it('should show placeholder when no value is selected', async () => {
      const options = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
      ]

      const wrapper = mount(Treeselect, {
        props: {
          options,
          multiple: false,
          placeholder: 'Select an option...',
        },
      })

      expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__placeholder').text()).toBe('Select an option...')
    })
  })
})
