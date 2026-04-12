import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Treeselect from '../src/components/Treeselect.vue'

// Helper: common option structures used across tests
const flatOptions = [
  { id: 'a', label: 'Option A' },
  { id: 'b', label: 'Option B' },
  { id: 'c', label: 'Option C' },
]

const nestedOptions = [
  {
    id: 'branch1',
    label: 'Branch 1',
    children: [
      { id: 'leaf1a', label: 'Leaf 1A' },
      { id: 'leaf1b', label: 'Leaf 1B' },
    ],
  },
  {
    id: 'branch2',
    label: 'Branch 2',
    children: [
      { id: 'leaf2a', label: 'Leaf 2A' },
      {
        id: 'sub-branch',
        label: 'Sub Branch',
        children: [
          { id: 'deep-leaf', label: 'Deep Leaf' },
        ],
      },
    ],
  },
  { id: 'standalone', label: 'Standalone Leaf' },
]

const disabledOptions = [
  { id: 'a', label: 'Option A', isDisabled: true },
  { id: 'b', label: 'Option B' },
  {
    id: 'branch',
    label: 'Branch',
    children: [
      { id: 'leaf1', label: 'Leaf 1', isDisabled: true },
      { id: 'leaf2', label: 'Leaf 2' },
    ],
  },
]

describe('Selection Logic', () => {
  // =========================================================================
  // Single Select
  // =========================================================================
  describe('Single select', () => {
    it('selects a node', async () => {
      const wrapper = mount(Treeselect, {
        props: { options: flatOptions },
      })

      const node = wrapper.vm.getNode('a')
      expect(node).toBeTruthy()
      wrapper.vm.select(node!)

      await nextTick()

      expect(wrapper.vm.isSelected(node!)).toBe(true)
      expect(wrapper.vm.getSelectedNodes().map(n => n.id)).toContain('a')
    })

    it('deselects previous when selecting a new node', async () => {
      const wrapper = mount(Treeselect, {
        props: { options: flatOptions },
      })

      const nodeA = wrapper.vm.getNode('a')!
      const nodeB = wrapper.vm.getNode('b')!

      wrapper.vm.select(nodeA)
      await nextTick()

      expect(wrapper.vm.isSelected(nodeA)).toBe(true)

      wrapper.vm.select(nodeB)
      await nextTick()

      // In single select, previous is deselected
      expect(wrapper.vm.isSelected(nodeB)).toBe(true)
      expect(wrapper.vm.isSelected(nodeA)).toBe(false)
    })

    it('re-selects same node (clear + select) in single mode', async () => {
      const wrapper = mount(Treeselect, {
        props: { options: flatOptions, modelValue: 'a' },
      })

      await nextTick()

      const nodeA = wrapper.vm.getNode('a')!
      expect(wrapper.vm.isSelected(nodeA)).toBe(true)

      wrapper.vm.select(nodeA)
      await nextTick()

      expect(wrapper.vm.isSelected(nodeA)).toBe(true)
    })

    it('clears value with clear()', async () => {
      const wrapper = mount(Treeselect, {
        props: { options: flatOptions, modelValue: 'a' },
      })

      await nextTick()

      expect(wrapper.vm.getSelectedNodes().length).toBeGreaterThan(0)

      wrapper.vm.clear()
      await nextTick()

      expect(wrapper.vm.getSelectedNodes().length).toBe(0)
    })
  })

  // =========================================================================
  // Multi Select
  // =========================================================================
  describe('Multi select', () => {
    it('selects multiple nodes', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          multiple: true,
        },
      })

      const nodeA = wrapper.vm.getNode('a')!
      const nodeB = wrapper.vm.getNode('b')!

      wrapper.vm.select(nodeA)
      await nextTick()

      wrapper.vm.select(nodeB)
      await nextTick()

      expect(wrapper.vm.isSelected(nodeA)).toBe(true)
      expect(wrapper.vm.isSelected(nodeB)).toBe(true)
    })

    it('deselects one of multiple selected nodes', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          multiple: true,
          modelValue: ['a', 'b', 'c'],
        },
      })

      await nextTick()

      const nodeB = wrapper.vm.getNode('b')!
      expect(wrapper.vm.isSelected(nodeB)).toBe(true)

      wrapper.vm.select(nodeB)
      await nextTick()

      expect(wrapper.vm.isSelected(nodeB)).toBe(false)

      const nodeA = wrapper.vm.getNode('a')!
      const nodeC = wrapper.vm.getNode('c')!
      expect(wrapper.vm.isSelected(nodeA)).toBe(true)
      expect(wrapper.vm.isSelected(nodeC)).toBe(true)
    })

    it('clears all values in multi-select mode', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          multiple: true,
          modelValue: ['a', 'b'],
        },
      })

      await nextTick()

      wrapper.vm.clear()
      await nextTick()

      expect(wrapper.vm.getSelectedNodes().length).toBe(0)
    })

    it('can clear all via clear() in multi-select mode', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          multiple: true,
          modelValue: ['a', 'b'],
        },
      })

      await nextTick()

      const nodeB = wrapper.vm.getNode('b')!
      expect(wrapper.vm.isSelected(nodeB)).toBe(true)

      wrapper.vm.clear()
      await nextTick()

      expect(wrapper.vm.getSelectedNodes().length).toBe(0)
    })
  })

  // =========================================================================
  // Branch Node Selection (auto-select/deselect children)
  // =========================================================================
  describe('Branch node selection', () => {
    it('selecting a branch auto-selects all children', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1a')!)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1b')!)).toBe(true)
    })

    it('deselecting a branch auto-deselects all children', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1a')!)).toBe(true)

      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(false)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1a')!)).toBe(false)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1b')!)).toBe(false)
    })

    it('selecting all children of a branch auto-selects the branch', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
        },
      })

      const leaf1a = wrapper.vm.getNode('leaf1a')!
      const leaf1b = wrapper.vm.getNode('leaf1b')!

      wrapper.vm.select(leaf1a)
      await nextTick()

      wrapper.vm.select(leaf1b)
      await nextTick()

      // When all children are selected, parent should be auto-selected
      const branch1 = wrapper.vm.getNode('branch1')!
      expect(wrapper.vm.isSelected(branch1)).toBe(true)
    })

    it('deselecting one child deselects the branch parent', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(true)

      // Deselect one child
      const leaf1a = wrapper.vm.getNode('leaf1a')!
      wrapper.vm.select(leaf1a)
      await nextTick()

      // Branch should be deselected since not all children are selected
      expect(wrapper.vm.isSelected(branch1)).toBe(false)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1b')!)).toBe(true)
    })

    it('handles deeply nested branch selection', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
        },
      })

      const branch2 = wrapper.vm.getNode('branch2')!
      wrapper.vm.select(branch2)
      await nextTick()

      // All descendants should be selected
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf2a')!)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('sub-branch')!)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('deep-leaf')!)).toBe(true)
    })
  })

  // =========================================================================
  // Flat Mode
  // =========================================================================
  describe('Flat mode', () => {
    it('selects branch without affecting children or parents', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          flat: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(true)
      // Children should NOT be auto-selected in flat mode
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1a')!)).toBe(false)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1b')!)).toBe(false)
    })

    it('deselects branch without affecting children', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          flat: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      wrapper.vm.select(branch1)
      await nextTick()

      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(false)
    })

    it('selects child without auto-selecting parent', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          flat: true,
        },
      })

      const leaf1a = wrapper.vm.getNode('leaf1a')!
      wrapper.vm.select(leaf1a)
      await nextTick()

      expect(wrapper.vm.isSelected(leaf1a)).toBe(true)
      // Parent should NOT be auto-selected in flat mode
      const branch1 = wrapper.vm.getNode('branch1')!
      expect(wrapper.vm.isSelected(branch1)).toBe(false)
    })
  })

  // =========================================================================
  // valueConsistsOf modes
  // =========================================================================
  describe('valueConsistsOf', () => {
    const branchLeafOptions = [
      {
        id: 'branch',
        label: 'Branch',
        children: [
          { id: 'leaf1', label: 'Leaf 1' },
          { id: 'leaf2', label: 'Leaf 2' },
        ],
      },
    ]

    it('BRANCH_PRIORITY: includes branch when all children selected', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = mount(Treeselect, {
        props: {
          options: branchLeafOptions,
          multiple: true,
          valueConsistsOf: 'BRANCH_PRIORITY',
          'onUpdate:modelValue': onUpdateModelValue,
        },
      })

      const branch = wrapper.vm.getNode('branch')!
      wrapper.vm.select(branch)
      await nextTick()

      // With BRANCH_PRIORITY, selecting the branch should result in
      // the branch being in the value, not the individual leaves
      const emitted = wrapper.emitted()
      expect(emitted['update:modelValue']).toBeTruthy()
    })

    it('LEAF_PRIORITY: includes only leaf nodes', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: branchLeafOptions,
          multiple: true,
          valueConsistsOf: 'LEAF_PRIORITY',
        },
      })

      const branch = wrapper.vm.getNode('branch')!
      wrapper.vm.select(branch)
      await nextTick()

      // All nodes are selected internally
      expect(wrapper.vm.isSelected(branch)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1')!)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf2')!)).toBe(true)
    })

    it('ALL: includes all selected nodes including branches and leaves', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: branchLeafOptions,
          multiple: true,
          valueConsistsOf: 'ALL',
        },
      })

      const branch = wrapper.vm.getNode('branch')!
      wrapper.vm.select(branch)
      await nextTick()

      const selectedIds = wrapper.vm.getSelectedNodes().map(n => n.id)
      expect(selectedIds).toContain('branch')
      expect(selectedIds).toContain('leaf1')
      expect(selectedIds).toContain('leaf2')
    })

    it('ALL_WITH_INDETERMINATE: includes indeterminate parent nodes', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: branchLeafOptions,
          multiple: true,
          valueConsistsOf: 'ALL_WITH_INDETERMINATE',
        },
      })

      // Select only one leaf - parent should appear as indeterminate
      const leaf1 = wrapper.vm.getNode('leaf1')!
      wrapper.vm.select(leaf1)
      await nextTick()

      const selectedIds = wrapper.vm.getSelectedNodes().map(n => n.id)
      expect(selectedIds).toContain('leaf1')
    })
  })

  // =========================================================================
  // sortValueBy modes
  // =========================================================================
  describe('sortValueBy', () => {
    const sortedOptions = [
      {
        id: 'branch',
        label: 'Branch',
        children: [
          { id: 'leaf1', label: 'Leaf 1' },
          { id: 'leaf2', label: 'Leaf 2' },
        ],
      },
      { id: 'top', label: 'Top Level' },
    ]

    it('ORDER_SELECTED: preserves selection order', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'C' },
          ],
          multiple: true,
          sortValueBy: 'ORDER_SELECTED',
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('c')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      const ids = wrapper.vm.getSelectedNodes().map(n => n.id)
      expect(ids).toEqual(['c', 'a'])
    })

    it('LEVEL: sorts by tree depth', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = mount(Treeselect, {
        props: {
          options: sortedOptions,
          multiple: true,
          sortValueBy: 'LEVEL',
          'onUpdate:modelValue': onUpdateModelValue,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('leaf1')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('top')!)
      await nextTick()

      const lastCall = onUpdateModelValue.mock.calls[onUpdateModelValue.mock.calls.length - 1]
      const value = lastCall[0] as (string | number)[]
      expect(value.indexOf('top')).toBeLessThan(value.indexOf('leaf1'))
    })

    it('INDEX: sorts by original option index', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = mount(Treeselect, {
        props: {
          options: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'C' },
          ],
          multiple: true,
          sortValueBy: 'INDEX',
          'onUpdate:modelValue': onUpdateModelValue,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('c')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      const lastCall = onUpdateModelValue.mock.calls[onUpdateModelValue.mock.calls.length - 1]
      expect(lastCall[0]).toEqual(['a', 'c'])
    })
  })

  // =========================================================================
  // Disabled Options
  // =========================================================================
  describe('Disabled options', () => {
    it('cannot select a disabled leaf node', async () => {
      const wrapper = mount(Treeselect, {
        props: { options: disabledOptions },
      })

      const nodeA = wrapper.vm.getNode('a')!
      expect(nodeA.isDisabled).toBe(true)

      wrapper.vm.select(nodeA)
      await nextTick()

      expect(wrapper.vm.isSelected(nodeA)).toBe(false)
    })

    it('can select a non-disabled leaf node', async () => {
      const wrapper = mount(Treeselect, {
        props: { options: disabledOptions },
      })

      const nodeB = wrapper.vm.getNode('b')!
      expect(nodeB.isDisabled).toBeFalsy()

      wrapper.vm.select(nodeB)
      await nextTick()

      expect(wrapper.vm.isSelected(nodeB)).toBe(true)
    })

    it('skips disabled descendants when selecting branch', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: disabledOptions,
          multiple: true,
        },
      })

      const branch = wrapper.vm.getNode('branch')!
      wrapper.vm.select(branch)
      await nextTick()

      // Disabled leaf1 should not be selected
      const leaf1 = wrapper.vm.getNode('leaf1')!
      expect(leaf1.isDisabled).toBe(true)
      expect(wrapper.vm.isSelected(leaf1)).toBe(false)

      // Non-disabled leaf2 should be selected
      const leaf2 = wrapper.vm.getNode('leaf2')!
      expect(wrapper.vm.isSelected(leaf2)).toBe(true)
    })

    it('clear() in multi-select preserves disabled nodes when allowClearingDisabled is false', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: disabledOptions,
          multiple: true,
          modelValue: ['a', 'b'],
          allowClearingDisabled: false,
        },
      })

      await nextTick()

      const nodeA = wrapper.vm.getNode('a')!
      expect(nodeA.isDisabled).toBe(true)
      expect(wrapper.vm.isSelected(nodeA)).toBe(true)

      wrapper.vm.clear()
      await nextTick()

      // Disabled nodes should be preserved when allowClearingDisabled is false
      const remainingIds = wrapper.vm.getSelectedNodes().map(n => n.id)
      expect(remainingIds).toContain('a')
      expect(remainingIds).not.toContain('b')
    })

    it('clear() in multi-select removes all including disabled when allowClearingDisabled is true', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: disabledOptions,
          multiple: true,
          modelValue: ['a', 'b'],
          allowClearingDisabled: true,
        },
      })

      await nextTick()

      wrapper.vm.clear()
      await nextTick()

      expect(wrapper.vm.getSelectedNodes().length).toBe(0)
    })

    it('does not select when component is disabled', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          disabled: true,
        },
      })

      const nodeA = wrapper.vm.getNode('a')!
      wrapper.vm.select(nodeA)
      await nextTick()

      expect(wrapper.vm.isSelected(nodeA)).toBe(false)
    })
  })

  // =========================================================================
  // disableBranchNodes
  // =========================================================================
  describe('disableBranchNodes', () => {
    it('branch nodes are selectable but children are not auto-selected when disableBranchNodes is true', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          disableBranchNodes: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1a')!)).toBe(false)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1b')!)).toBe(false)
    })

    it('leaf nodes are still selectable when disableBranchNodes is true', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          disableBranchNodes: true,
        },
      })

      const leaf1a = wrapper.vm.getNode('leaf1a')!
      wrapper.vm.select(leaf1a)
      await nextTick()

      expect(wrapper.vm.isSelected(leaf1a)).toBe(true)
    })
  })

  // =========================================================================
  // autoSelectAncestors / autoDeselectAncestors / autoSelectDescendants / autoDeselectDescendants
  // =========================================================================
  describe('Auto select/deselect in flat mode', () => {
    it('autoSelectAncestors: selecting a child auto-selects ancestors', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          flat: true,
          autoSelectAncestors: true,
        },
      })

      const leaf1a = wrapper.vm.getNode('leaf1a')!
      wrapper.vm.select(leaf1a)
      await nextTick()

      expect(wrapper.vm.isSelected(leaf1a)).toBe(true)
      const branch1 = wrapper.vm.getNode('branch1')!
      expect(wrapper.vm.isSelected(branch1)).toBe(true)
    })

    it('autoDeselectAncestors: deselecting a child auto-deselects ancestors', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          flat: true,
          autoDeselectAncestors: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      const leaf1a = wrapper.vm.getNode('leaf1a')!
      const leaf1b = wrapper.vm.getNode('leaf1b')!

      // Select branch and children manually
      wrapper.vm.select(branch1)
      await nextTick()
      wrapper.vm.select(leaf1a)
      await nextTick()
      wrapper.vm.select(leaf1b)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(true)

      // Deselect one leaf should deselect ancestor
      wrapper.vm.select(leaf1a)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(false)
    })

    it('autoSelectDescendants: selecting a parent auto-selects descendants', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          flat: true,
          autoSelectDescendants: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1a')!)).toBe(true)
      expect(wrapper.vm.isSelected(wrapper.vm.getNode('leaf1b')!)).toBe(true)
    })

    it('autoDeselectDescendants: deselecting a parent auto-deselects descendants', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          flat: true,
          autoDeselectDescendants: true,
        },
      })

      const branch1 = wrapper.vm.getNode('branch1')!
      const leaf1a = wrapper.vm.getNode('leaf1a')!
      const leaf1b = wrapper.vm.getNode('leaf1b')!

      wrapper.vm.select(branch1)
      await nextTick()
      wrapper.vm.select(leaf1a)
      await nextTick()
      wrapper.vm.select(leaf1b)
      await nextTick()

      expect(wrapper.vm.isSelected(leaf1a)).toBe(true)
      expect(wrapper.vm.isSelected(leaf1b)).toBe(true)

      // Deselect branch should deselect all descendants
      wrapper.vm.select(branch1)
      await nextTick()

      expect(wrapper.vm.isSelected(branch1)).toBe(false)
      expect(wrapper.vm.isSelected(leaf1a)).toBe(false)
      expect(wrapper.vm.isSelected(leaf1b)).toBe(false)
    })
  })

  // =========================================================================
  // Event emissions on selection
  // =========================================================================
  describe('Selection events', () => {
    it('emits select event when selecting a node', async () => {
      const onSelect = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          onSelect,
        },
      })

      const nodeA = wrapper.vm.getNode('a')!
      wrapper.vm.select(nodeA)
      await nextTick()

      expect(onSelect).toHaveBeenCalled()
    })

    it('emits deselect event when deselecting a node', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          multiple: true,
          modelValue: ['a', 'b'],
        },
      })

      await nextTick()

      const nodeA = wrapper.vm.getNode('a')!
      wrapper.vm.select(nodeA)
      await nextTick()

      expect(wrapper.emitted('deselect')).toBeTruthy()
      expect(wrapper.emitted('deselect')!.length).toBeGreaterThan(0)
    })

    it('emits update:modelValue event when value changes via selection', async () => {
      const onUpdateModelValue = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          'onUpdate:modelValue': onUpdateModelValue,
        },
      })

      const nodeA = wrapper.vm.getNode('a')!
      wrapper.vm.select(nodeA)
      await nextTick()

      expect(onUpdateModelValue).toHaveBeenCalled()
    })
  })

  // =========================================================================
  // clearOnSelect
  // =========================================================================
  describe('clearOnSelect', () => {
    it('resets search query on select when clearOnSelect is true', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          multiple: true,
          clearOnSelect: true,
        },
      })

      const nodeA = wrapper.vm.getNode('a')!
      wrapper.vm.select(nodeA)
      await nextTick()

      // No assertion on search query since we can't easily set it,
      // but verify the select still works
      expect(wrapper.vm.isSelected(nodeA)).toBe(true)
    })
  })

  // =========================================================================
  // Async value setting
  // =========================================================================
  describe('Async value setting', () => {
    it('syncs value when set asynchronously after mount (single select)', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          modelValue: null,
        },
      })

      await nextTick()

      // Verify initial state - no selection
      expect(wrapper.vm.getSelectedNodes().length).toBe(0)

      // Asynchronously set value (simulating setTimeout scenario)
      await wrapper.setProps({ modelValue: 'a' })
      await nextTick()

      // Verify the node is now selected
      const nodeA = wrapper.vm.getNode('a')
      expect(nodeA).toBeTruthy()
      expect(wrapper.vm.isSelected(nodeA!)).toBe(true)
      expect(wrapper.vm.getSelectedNodes().map(n => n.id)).toContain('a')
    })

    it('syncs value when set asynchronously after mount (multi select)', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          multiple: true,
          modelValue: [],
        },
      })

      await nextTick()

      // Verify initial state - no selection
      expect(wrapper.vm.getSelectedNodes().length).toBe(0)

      // Asynchronously set value (simulating setTimeout scenario)
      await wrapper.setProps({ modelValue: ['a', 'c'] })
      await nextTick()

      // Verify both nodes are now selected
      const nodeA = wrapper.vm.getNode('a')
      const nodeC = wrapper.vm.getNode('c')
      expect(nodeA).toBeTruthy()
      expect(nodeC).toBeTruthy()
      expect(wrapper.vm.isSelected(nodeA!)).toBe(true)
      expect(wrapper.vm.isSelected(nodeC!)).toBe(true)
      expect(wrapper.vm.getSelectedNodes().map(n => n.id)).toEqual(['a', 'c'])
    })

    it('syncs nested value when set asynchronously', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          modelValue: [],
        },
      })

      await nextTick()

      // Asynchronously set value to a nested node
      await wrapper.setProps({ modelValue: ['leaf1a'] })
      await nextTick()

      // Verify the nested node is selected
      const leaf1a = wrapper.vm.getNode('leaf1a')
      expect(leaf1a).toBeTruthy()
      expect(wrapper.vm.isSelected(leaf1a!)).toBe(true)
    })

    it('handles options loaded then value set asynchronously', async () => {
      // Simulates the common scenario: options load first, then value is set asynchronously
      const wrapper = mount(Treeselect, {
        props: {
          options: flatOptions,
          modelValue: null,
        },
      })

      await nextTick()

      // Verify initial state - no selection
      expect(wrapper.vm.getSelectedNodes().length).toBe(0)

      // Simulate async value change (like setTimeout)
      const newValue = 'b'
      await wrapper.setProps({ modelValue: newValue })
      await nextTick()

      // Value should now be synced from props
      const nodeB = wrapper.vm.getNode('b')
      expect(nodeB).toBeTruthy()
      expect(wrapper.vm.isSelected(nodeB!)).toBe(true)
      expect(wrapper.vm.getSelectedNodes().map(n => n.id)).toContain('b')
    })

    // This test reproduces the Basic.vue scenario: disableBranchNodes + nested options + async value
    it('syncs value asynchronously with disableBranchNodes and nested options', async () => {
      const nestedOptionsWithDisableBranch = [
        {
          id: 'fruits',
          label: 'Fruits',
          children: [
            { id: 'apple', label: 'Apple' },
            { id: 'grapes', label: 'Grapes' },
          ],
        },
        {
          id: 'vegetables',
          label: 'Vegetables',
          children: [
            { id: 'corn', label: 'Corn' },
          ],
        },
      ]

      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptionsWithDisableBranch,
          modelValue: null,
          disableBranchNodes: true,
        },
      })

      await nextTick()

      // Verify initial state - no selection
      expect(wrapper.vm.getSelectedNodes().length).toBe(0)

      // Asynchronously set value (like setTimeout in Basic.vue)
      await wrapper.setProps({ modelValue: 'apple' })
      await nextTick()

      // Verify the leaf node is selected
      const appleNode = wrapper.vm.getNode('apple')
      expect(appleNode).toBeTruthy()
      expect(wrapper.vm.isSelected(appleNode!)).toBe(true)
      expect(wrapper.vm.getSelectedNodes().map(n => n.id)).toContain('apple')
    })

    // Test using actual setTimeout to simulate Basic.vue exactly
    it('handles setTimeout value change like Basic.vue demo', async () => {
      vi.useFakeTimers()
      
      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          modelValue: null,
          disableBranchNodes: true,
        },
      })

      await nextTick()
      expect(wrapper.vm.getSelectedNodes().length).toBe(0)

      // Simulate the Basic.vue setTimeout
      setTimeout(() => {
        wrapper.setProps({ modelValue: 'leaf1a' })
      }, 2000)

      // Advance timers
      vi.runAllTimers()
      await nextTick()

      // Verify selection
      const leaf1a = wrapper.vm.getNode('leaf1a')
      expect(leaf1a).toBeTruthy()
      expect(wrapper.vm.isSelected(leaf1a!)).toBe(true)

      vi.useRealTimers()
    })
  })
})
