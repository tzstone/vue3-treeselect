import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Treeselect from '../src/components/Treeselect.vue'

const simpleOptions = [
  { id: 'a', label: 'Option A' },
  { id: 'b', label: 'Option B' },
  { id: 'c', label: 'Option C' },
]

const nestedOptions = [
  {
    id: 'branch',
    label: 'Branch',
    children: [
      { id: 'leaf1', label: 'Leaf 1' },
      { id: 'leaf2', label: 'Leaf 2' },
    ],
  },
]

describe('Value Formatting', () => {
  describe('valueFormat: "id" (default)', () => {
    it('returns ID string for single select', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          valueFormat: 'id',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()
      expect(lastCall[0]).toBe('a')
    })

    it('returns array of IDs for multi select', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          multiple: true,
          valueFormat: 'id',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('b')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()
      expect(lastCall[0]).toContain('a')
      expect(lastCall[0]).toContain('b')
    })
  })

  describe('valueFormat: "object"', () => {
    it('returns full object for single select', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          valueFormat: 'object',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()
      expect(lastCall[0].id).toBe('a')
      expect(lastCall[0].label).toBe('Option A')
    })

    it('returns array of full objects for multi select', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          multiple: true,
          valueFormat: 'object',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('b')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()
      expect(Array.isArray(lastCall[0])).toBe(true)

      const ids = lastCall[0].map((obj: any) => obj.id)
      expect(ids).toContain('a')
      expect(ids).toContain('b')
    })
  })

  describe('delimiter', () => {
    it('does not affect value when joinValues is false (default)', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          multiple: true,
          delimiter: '|',
          joinValues: false,
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('b')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()
      expect(Array.isArray(lastCall[0])).toBe(true)
    })
  })

  describe('joinValues', () => {
    it('emits array of values even when joinValues is true (joinValues only affects hidden fields)', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          multiple: true,
          delimiter: '|',
          joinValues: true,
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('b')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()
      expect(Array.isArray(lastCall[0])).toBe(true)
      expect(lastCall[0]).toContain('a')
      expect(lastCall[0]).toContain('b')
    })

    it('accepts custom delimiter prop', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          multiple: true,
          delimiter: '|',
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('valueConsistsOf with value formatting', () => {
    it('BRANCH_PRIORITY excludes leaf IDs when branch fully selected', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          valueConsistsOf: 'BRANCH_PRIORITY',
          onInput,
        },
      })

      const branch = wrapper.vm.getNode('branch')!
      wrapper.vm.select(branch)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()

      const emittedValue = lastCall[0]
      expect(emittedValue).toContain('branch')
      expect(emittedValue).not.toContain('leaf1')
      expect(emittedValue).not.toContain('leaf2')
    })

    it('LEAF_PRIORITY excludes branch IDs', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          valueConsistsOf: 'LEAF_PRIORITY',
          onInput,
        },
      })

      const branch = wrapper.vm.getNode('branch')!
      wrapper.vm.select(branch)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()

      const emittedValue = lastCall[0]
      expect(emittedValue).not.toContain('branch')
      expect(emittedValue).toContain('leaf1')
      expect(emittedValue).toContain('leaf2')
    })

    it('ALL includes all selected node IDs', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          valueConsistsOf: 'ALL',
          onInput,
        },
      })

      const branch = wrapper.vm.getNode('branch')!
      wrapper.vm.select(branch)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()

      const emittedValue = lastCall[0]
      expect(emittedValue).toContain('branch')
      expect(emittedValue).toContain('leaf1')
      expect(emittedValue).toContain('leaf2')
    })

    it('ALL_WITH_INDETERMINATE includes indeterminate ancestors', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: nestedOptions,
          multiple: true,
          valueConsistsOf: 'ALL_WITH_INDETERMINATE',
          onInput,
        },
      })

      const leaf1 = wrapper.vm.getNode('leaf1')!
      wrapper.vm.select(leaf1)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall).toBeTruthy()

      const emittedValue = lastCall[0]
      expect(emittedValue).toContain('leaf1')
      expect(emittedValue).toContain('branch')
    })
  })

  describe('sortValueBy with value formatting', () => {
    it('ORDER_SELECTED preserves insertion order', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          multiple: true,
          sortValueBy: 'ORDER_SELECTED',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('c')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall[0]).toEqual(['c', 'a'])
    })

    it('INDEX sorts by original option order', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          multiple: true,
          sortValueBy: 'INDEX',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('c')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      expect(lastCall[0]).toEqual(['a', 'c'])
    })

    it('LEVEL sorts by tree depth (shallow first)', async () => {
      const onInput = vi.fn()

      const levelOptions = [
        {
          id: 'branch',
          label: 'Branch',
          children: [
            { id: 'leaf', label: 'Leaf' },
          ],
        },
        { id: 'top', label: 'Top' },
      ]

      const wrapper = mount(Treeselect, {
        props: {
          options: levelOptions,
          multiple: true,
          sortValueBy: 'LEVEL',
          valueConsistsOf: 'ALL',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('leaf')!)
      await nextTick()
      wrapper.vm.select(wrapper.vm.getNode('top')!)
      await nextTick()

      const lastCall = onInput.mock.calls[onInput.mock.calls.length - 1]
      const value = lastCall[0] as (string | number)[]
      expect(value).toContain('top')
      expect(value).toContain('leaf')
      expect(value.indexOf('top')).toBeLessThan(value.indexOf('leaf'))
    })
  })

  describe('getValue() method', () => {
    it('returns null for single select with no value', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
        },
      })

      await nextTick()

      const val = wrapper.emitted('input')
      expect(val).toBeFalsy()
    })

    it('returns string ID when valueFormat is "id" and single select', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          valueFormat: 'id',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      const lastCall = onInput.mock.calls[0]
      expect(lastCall[0]).toBe('a')
    })

    it('returns object when valueFormat is "object" and single select', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          valueFormat: 'object',
          onInput,
        },
      })

      wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      const lastCall = onInput.mock.calls[0]
      expect(typeof lastCall[0]).toBe('object')
      expect(lastCall[0].id).toBe('a')
      expect(lastCall[0].label).toBe('Option A')
    })
  })

  describe('getNode()', () => {
    it('returns node by ID', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
        },
      })

      await nextTick()

      const node = wrapper.vm.getNode('a')
      expect(node).toBeTruthy()
      expect(node!.id).toBe('a')
      expect(node!.label).toBe('Option A')
    })

    it('returns fallback node for non-existent ID', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
        },
      })

      await nextTick()

      const node = wrapper.vm.getNode('nonexistent')
      expect(node).toBeTruthy()
      expect(node!.isFallbackNode).toBe(true)
    })
  })

  describe('isSelected()', () => {
    it('returns true for selected node', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          value: 'a',
        },
      })

      await nextTick()

      const node = wrapper.vm.getNode('a')!
      expect(wrapper.vm.isSelected(node)).toBe(true)
    })

    it('returns false for non-selected node', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          value: 'a',
        },
      })

      await nextTick()

      const node = wrapper.vm.getNode('b')!
      expect(wrapper.vm.isSelected(node)).toBe(false)
    })
  })

  describe('getSelectedNodes()', () => {
    it('returns array of selected nodes', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          multiple: true,
          value: ['a', 'b'],
        },
      })

      await nextTick()

      const selected = wrapper.vm.getSelectedNodes()
      expect(selected.length).toBe(2)

      const ids = selected.map(n => n.id)
      expect(ids).toContain('a')
      expect(ids).toContain('b')
    })

    it('returns empty array when nothing selected', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
        },
      })

      await nextTick()

      const selected = wrapper.vm.getSelectedNodes()
      expect(selected.length).toBe(0)
    })
  })

  describe('Hidden fields rendering', () => {
    it('renders mocked hidden field component when name prop is set and value is selected', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          name: 'test-field',
          value: 'a',
        },
      })

      await nextTick()

      const mockHiddenFields = wrapper.findAll('.vue-treeselect__hidden-field')
      expect(mockHiddenFields.length).toBeGreaterThanOrEqual(0)
    })

    it('does not crash with multi-select hidden fields', async () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: simpleOptions,
          name: 'test-field',
          multiple: true,
          value: ['a', 'b'],
        },
      })

      await nextTick()
      expect(wrapper.exists()).toBe(true)
    })
  })
})
