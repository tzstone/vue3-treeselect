import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { provide, defineComponent, h, computed } from 'vue'
import Control from '../src/components/Control.vue'
import ControlSimple from '../src/components/ControlSimple.vue'
import type { TreeselectInstance } from '../src/types'
import { TRESELECT_INSTANCE_KEY } from '../src/types'

describe('Task 8: Control import test', () => {
  it('should render simple Control component', async () => {
    const TestWrapper = defineComponent({
      name: 'TestWrapper',
      components: { ControlSimple },
      setup() {
        return {}
      },
      render() {
        return h('div', [h(ControlSimple)])
      },
    })

    const wrapper = mount(TestWrapper)
    const html = wrapper.html()
    console.log('Simple Control HTML:', html)

    expect(html).toContain('vue-treeselect__control')
  })

  it('should render full Control component', async () => {
    const mockInstance: TreeselectInstance = {
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
    }

    const TestWrapper = defineComponent({
      name: 'TestWrapper',
      components: { Control },
      setup() {
        provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
        return {}
      },
      render() {
        return h('div', [h(Control)])
      },
    })

    const wrapper = mount(TestWrapper)
    const html = wrapper.html()
    const controlHtml = wrapper.findComponent(Control).html()
    console.log('Full HTML:', html)
    console.log('Control HTML:', controlHtml)
    console.log('Control found:', wrapper.findComponent(Control).exists())

    expect(wrapper.findComponent(Control).exists()).toBe(true)
    expect(controlHtml).toContain('vue-treeselect__control')
  })
})
