import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed } from 'vue'

import MultiValue from '../src/components/MultiValue.vue'
import type { TreeselectNode } from '../src/types'
import { TRESELECT_INSTANCE_KEY } from '../src/types'

describe('Task 9: MultiValue Component', () => {
  function createMockNode(id: string, label: string): TreeselectNode {
    return {
      id,
      label,
      lowerLabel: label.toLowerCase(),
      lowerCased: {},
      nestedSearchLabel: label.toLowerCase(),
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
      raw: { id, label },
    }
  }

  it('should render all selected nodes when limit is Infinity', () => {
    const nodes = [
      createMockNode('a', 'Option A'),
      createMockNode('b', 'Option B'),
      createMockNode('c', 'Option C'),
    ]

    const mockInstance = {
      selectedNodes: nodes,
      hasValue: true,
      searchable: true,
      trigger: {
        isFocused: false,
        searchQuery: '',
      },
      limit: Infinity,
      limitText: (count: number) => `and ${count} more`,
      getNode: vi.fn((id) => nodes.find(n => n.id === id) || null),
    }

    const wrapper = mount(MultiValue, {
      global: {
        provide: {
          [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
        },
      },
    })

    expect(wrapper.find('.vue-treeselect__multi-value').exists()).toBe(true)
    // Should render all 3 items
    expect(wrapper.findAll('.vue-treeselect__multi-value-item-container').length).toBe(3)
    // Should not show limit tip
    expect(wrapper.find('.vue-treeselect__limit-tip').exists()).toBe(false)
  })

  it('should respect limit and show correct count', () => {
    const nodes = [
      createMockNode('a', 'Option A'),
      createMockNode('b', 'Option B'),
      createMockNode('c', 'Option C'),
      createMockNode('d', 'Option D'),
      createMockNode('e', 'Option E'),
    ]

    const mockInstance = {
      selectedNodes: nodes,
      hasValue: true,
      searchable: true,
      trigger: {
        isFocused: false,
        searchQuery: '',
      },
      limit: 2,
      limitText: (count: number) => `and ${count} more`,
      getNode: vi.fn((id) => nodes.find(n => n.id === id) || null),
    }

    const wrapper = mount(MultiValue, {
      global: {
        provide: {
          [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
        },
      },
    })

    expect(wrapper.find('.vue-treeselect__multi-value').exists()).toBe(true)
    // Should render only 2 items (the limit)
    expect(wrapper.findAll('.vue-treeselect__multi-value-item-container').length).toBe(2)
    // Should show limit tip
    expect(wrapper.find('.vue-treeselect__limit-tip').exists()).toBe(true)
    // Should show correct count (5 total - 2 limit = 3 more)
    expect(wrapper.find('.vue-treeselect__limit-tip-text').text()).toBe('and 3 more')
  })

  it('should not show limit tip when count equals limit', () => {
    const nodes = [
      createMockNode('a', 'Option A'),
      createMockNode('b', 'Option B'),
    ]

    const mockInstance = {
      selectedNodes: nodes,
      hasValue: true,
      searchable: true,
      trigger: {
        isFocused: false,
        searchQuery: '',
      },
      limit: 2,
      limitText: (count: number) => `and ${count} more`,
      getNode: vi.fn((id) => nodes.find(n => n.id === id) || null),
    }

    const wrapper = mount(MultiValue, {
      global: {
        provide: {
          [TRESELECT_INSTANCE_KEY as symbol]: computed(() => mockInstance),
        },
      },
    })

    expect(wrapper.find('.vue-treeselect__multi-value').exists()).toBe(true)
    // Should render all 2 items
    expect(wrapper.findAll('.vue-treeselect__multi-value-item-container').length).toBe(2)
    // Should not show limit tip (2 items = 2 limit, nothing hidden)
    expect(wrapper.find('.vue-treeselect__limit-tip').exists()).toBe(false)
  })
})
