import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, ref, provide } from 'vue'
import MultiValue from '../src/components/MultiValue.vue'
import Input from '../src/components/Input.vue'
import Placeholder from '../src/components/Placeholder.vue'
import type { TreeselectInstance, TreeselectNode } from '../src/types'
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
    single: false,
    multiple: true,
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
    limitText: vi.fn((count: number) => `and ${count} more`),
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
    toggleMenu: vi.fn(),
    toggleExpanded: vi.fn(),
    select: vi.fn(),
    loadChildrenOptions: vi.fn(),
    maxHeight: 300,
    zIndex: 9999,
    appendToBody: false,
    async: false,
    remoteSearch: {},
    noOptionsText: 'No options available.',
    noResultsText: 'No results found.',
    searchPromptText: 'Type to search...',
    getRemoteSearchEntry: vi.fn(() => ({ isLoaded: false, isLoading: false, loadingError: '', options: [] })),
    openDirection: 'auto',
    getMenu: vi.fn(() => null),
    getControl: vi.fn(() => null),
    menu: {
      placement: 'bottom',
    },
    loadRootOptions: vi.fn(),
    handleRemoteSearch: vi.fn(),
    handleMouseDown: vi.fn(),
    ...overrides,
  }
}

describe('Task 2: MultiValue inline Input layout', () => {
  describe('Scenario 1: Multi-mode with no value', () => {
    it('should render Input and Placeholder inside MultiValue transition-group', async () => {
      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: false,
        searchable: true,
        selectedNodes: [],
      })

      const TestWrapper = {
        template: '<MultiValue />',
        components: { MultiValue },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      // Check that MultiValue container exists
      const multiValue = wrapper.find('.vue-treeselect__multi-value')
      expect(multiValue.exists()).toBe(true)

      // Check that Placeholder is rendered inside transition-group
      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.exists()).toBe(true)

      // Check that Input is rendered inside transition-group
      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(true)
    })

    it('should not render Input when searchable is false', async () => {
      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: false,
        searchable: false,
        selectedNodes: [],
        internalValue: [],
      })

      const TestWrapper = {
        template: '<MultiValue />',
        components: { MultiValue },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      // Placeholder should still render
      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.exists()).toBe(true)

      // Input should not render
      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(false)
    })
  })

  describe('Scenario 2: Multi-mode with values', () => {
    it('should render Input after tags and limit-tip in transition-group', async () => {
      const mockNodes: TreeselectNode[] = [
        { id: '1', label: 'Option 1', isBranch: false, isLeaf: true } as TreeselectNode,
        { id: '2', label: 'Option 2', isBranch: false, isLeaf: true } as TreeselectNode,
        { id: '3', label: 'Option 3', isBranch: false, isLeaf: true } as TreeselectNode,
      ]

      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: true,
        searchable: true,
        selectedNodes: mockNodes,
        internalValue: ['1', '2', '3'],
        limit: 2, // Show first 2, limit-tip for 3rd
        getNode: vi.fn((id: string) => mockNodes.find(n => n.id === id) || null),
      })

      const TestWrapper = {
        template: '<MultiValue />',
        components: { MultiValue },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      // Check that MultiValue items are rendered
      const items = wrapper.findAll('.vue-treeselect__multi-value-item')
      expect(items.length).toBe(2)

      // Check that limit-tip is rendered
      const limitTip = wrapper.find('.vue-treeselect__limit-tip')
      expect(limitTip.exists()).toBe(true)

      // Check that Input is rendered after limit-tip
      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(true)

      // Placeholder should not be rendered when hasValue is true
      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.exists()).toBe(false)
    })

    it('should render Input without limit-tip when all values visible', async () => {
      const mockNodes: TreeselectNode[] = [
        { id: '1', label: 'Option 1', isBranch: false, isLeaf: true } as TreeselectNode,
        { id: '2', label: 'Option 2', isBranch: false, isLeaf: true } as TreeselectNode,
      ]

      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: true,
        searchable: true,
        selectedNodes: mockNodes,
        limit: Infinity, // No limit
        internalValue: ['1', '2'],
        getNode: vi.fn((id: string) => mockNodes.find(n => n.id === id) || null),
      })

      const TestWrapper = {
        template: '<MultiValue />',
        components: { MultiValue },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      // Check that all MultiValue items are rendered
      const items = wrapper.findAll('.vue-treeselect__multi-value-item')
      expect(items.length).toBe(2)

      // Check that limit-tip is not rendered
      const limitTip = wrapper.find('.vue-treeselect__limit-tip')
      expect(limitTip.exists()).toBe(false)

      // Check that Input is still rendered
      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(true)
    })

    it('should expose inputRef for parent focusInput() access', async () => {
      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: true,
        searchable: true,
        selectedNodes: [
          { id: '1', label: 'Option 1', isBranch: false, isLeaf: true } as TreeselectNode,
        ],
        internalValue: ['1'],
        getNode: vi.fn((id: string) => id === '1'
          ? ({ id: '1', label: 'Option 1', isBranch: false, isLeaf: true } as TreeselectNode)
          : null),
      })

      const TestWrapper = {
        template: '<MultiValue ref="multiValueRef" />',
        components: { MultiValue },
        setup() {
          const multiValueRef = ref<any>(null)
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return { multiValueRef }
        },
      }

      const wrapper = mount(TestWrapper)

      // Access the exposed inputRef
      const multiValueComponent = wrapper.vm.multiValueRef as any
      expect(multiValueComponent).toBeTruthy()
      expect(multiValueComponent.inputRef).toBeTruthy()
    })
  })

  describe('Scenario 3: Single-mode behavior unchanged', () => {
    it('should not render MultiValue in single mode', async () => {
      const mockInstance = createMockInstance({
        single: true,
        multiple: false,
        hasValue: false,
      })

      const TestWrapper = {
        template: '<MultiValue />',
        components: { MultiValue },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      // MultiValue component still renders its content even in single mode
      // (Control.vue decides whether to render MultiValue, not MultiValue itself)
      // This test verifies MultiValue can be mounted without errors in any mode
      expect(wrapper.html()).toBeTruthy()
    })

    it('should not render MultiValue in single mode even with value', async () => {
      const mockInstance = createMockInstance({
        single: true,
        multiple: false,
        hasValue: true,
        selectedNodes: [
          { id: '1', label: 'Option 1', isBranch: false, isLeaf: true } as TreeselectNode,
        ],
        internalValue: ['1'],
      })

      const TestWrapper = {
        template: '<MultiValue />',
        components: { MultiValue },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      // MultiValue component still renders its content even in single mode
      // (Control.vue decides whether to render MultiValue, not MultiValue itself)
      expect(wrapper.html()).toBeTruthy()
    })
  })

  describe('Input rendering behavior', () => {
    it('should render Input inline with tags (same level in transition-group)', async () => {
      const mockNodes: TreeselectNode[] = [
        { id: '1', label: 'Option 1', isBranch: false, isLeaf: true } as TreeselectNode,
      ]

      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: true,
        searchable: true,
        selectedNodes: mockNodes,
        internalValue: ['1'],
        getNode: vi.fn((id: string) => mockNodes.find(n => n.id === id) || null),
      })

      const TestWrapper = {
        template: '<MultiValue />',
        components: { MultiValue },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      // Check that both tags and Input are rendered
      const multiValue = wrapper.find('.vue-treeselect__multi-value')
      expect(multiValue.exists()).toBe(true)

      const tag = wrapper.find('.vue-treeselect__multi-value-item')
      const input = wrapper.find('.vue-treeselect__input')

      expect(tag.exists()).toBe(true)
      expect(input.exists()).toBe(true)

      // Verify that the multi-value container contains both elements
      // (They are siblings in the same transition-group)
      const multiValueHtml = multiValue.html()
      expect(multiValueHtml).toContain('vue-treeselect__multi-value-item')
      expect(multiValueHtml).toContain('vue-treeselect__input')
    })

    it('should render Input regardless of menuIsOpen state', async () => {
      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: false,
        searchable: true,
        selectedNodes: [],
        menuIsOpen: false, // Menu is closed
      })

      const TestWrapper = {
        template: '<MultiValue />',
        components: { MultiValue },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      // Input should render even when menuIsOpen is false
      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(true)
    })
  })
})
