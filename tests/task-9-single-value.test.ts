import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'

import SingleValue from '../src/components/SingleValue.vue'
import type { TreeselectInstance, TreeselectNode } from '../src/types'
import { TRESELECT_INSTANCE_KEY } from '../src/types'

describe('Task 9: SingleValue Component', () => {
  it('should render selected node label', () => {
    const mockNode: TreeselectNode = {
      id: 'a',
      label: 'Option A',
      lowerLabel: 'option a',
      lowerCased: {},
      nestedSearchLabel: 'option a',
      isLeaf: true,
      isBranch: false,
      isDisabled: false,
      isNew: false,
      isMatched: false,
      isHighlighted: false,
      hasMatchedDescendants: false,
      hasDisabledDescendants: false,
      hasChildren: false,
      hasLoadedChildren: true,
      isExpanded: false,
      isExpandedOnSearch: false,
      showAllChildrenOnSearch: false,
      isLoading: false,
      loadingError: '',
      childrenStates: { isLoaded: true, isLoading: false, loadingError: '' },
      count: { ALL_CHILDREN: 0, ALL_DESCENDANTS: 0, LEAF_CHILDREN: 0, LEAF_DESCENDANTS: 0 },
      isSelected: true,
      level: 0,
      index: [0],
      ancestors: [],
      parentNode: null,
      isRootNode: true,
      isFallbackNode: false,
      children: [],
      raw: { id: 'a', label: 'Option A' },
    }

    const mockInstance: TreeselectInstance = {
      isFocused: false,
      searchQuery: '',
      menuIsOpen: false,
      currentHighlightedOptionId: null,
      selectedNodes: [mockNode],
      hasValue: true,
      single: true,
      multiple: false,
      hasBranchNodes: false,
      openMenu: vi.fn(),
      closeMenu: vi.fn(),
      clear: vi.fn(),
      focusInput: vi.fn(),
      blurInput: vi.fn(),
      getSelectedNodes: vi.fn(() => [mockNode]),
      getNode: vi.fn(() => mockNode),
      isSelected: vi.fn(() => true),
      toggleExpanded: vi.fn(),
      select: vi.fn(),
      loadChildrenOptions: vi.fn(),
    }

    const wrapper = mount(SingleValue, {
      global: {
        provide: {
          [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
        },
      },
    })

    expect(wrapper.find('.vue-treeselect__single-value').exists()).toBe(true)
    expect(wrapper.text()).toContain('Option A')
  })

  it('should not render when hasValue is false', () => {
    const mockInstance: TreeselectInstance = {
      isFocused: false,
      searchQuery: '',
      menuIsOpen: false,
      currentHighlightedOptionId: null,
      selectedNodes: [],
      hasValue: false,
      single: true,
      multiple: false,
      hasBranchNodes: false,
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
    }

    const wrapper = mount(SingleValue, {
      global: {
        provide: {
          [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
        },
      },
    })

    expect(wrapper.find('.vue-treeselect__single-value').exists()).toBe(false)
  })

  it('should not render when searchQuery is not empty', () => {
    const mockNode: TreeselectNode = {
      id: 'a',
      label: 'Option A',
      lowerLabel: 'option a',
      lowerCased: {},
      nestedSearchLabel: 'option a',
      isLeaf: true,
      isBranch: false,
      isDisabled: false,
      isNew: false,
      isMatched: false,
      isHighlighted: false,
      hasMatchedDescendants: false,
      hasDisabledDescendants: false,
      hasChildren: false,
      hasLoadedChildren: true,
      isExpanded: false,
      isExpandedOnSearch: false,
      showAllChildrenOnSearch: false,
      isLoading: false,
      loadingError: '',
      childrenStates: { isLoaded: true, isLoading: false, loadingError: '' },
      count: { ALL_CHILDREN: 0, ALL_DESCENDANTS: 0, LEAF_CHILDREN: 0, LEAF_DESCENDANTS: 0 },
      isSelected: true,
      level: 0,
      index: [0],
      ancestors: [],
      parentNode: null,
      isRootNode: true,
      isFallbackNode: false,
      children: [],
      raw: { id: 'a', label: 'Option A' },
    }

    const mockInstance: TreeselectInstance = {
      isFocused: false,
      searchQuery: 'search',
      menuIsOpen: false,
      currentHighlightedOptionId: null,
      selectedNodes: [mockNode],
      hasValue: true,
      single: true,
      multiple: false,
      hasBranchNodes: false,
      openMenu: vi.fn(),
      closeMenu: vi.fn(),
      clear: vi.fn(),
      focusInput: vi.fn(),
      blurInput: vi.fn(),
      getSelectedNodes: vi.fn(() => [mockNode]),
      getNode: vi.fn(() => mockNode),
      isSelected: vi.fn(() => true),
      toggleExpanded: vi.fn(),
      select: vi.fn(),
      loadChildrenOptions: vi.fn(),
    }

    const wrapper = mount(SingleValue, {
      global: {
        provide: {
          [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
        },
      },
    })

    expect(wrapper.find('.vue-treeselect__single-value').exists()).toBe(false)
  })
})
