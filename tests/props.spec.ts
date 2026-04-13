import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Treeselect from '../src/components/Treeselect.vue'

describe('Props', () => {
  describe('Boolean Props', () => {
    it('accepts multiple prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          multiple: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts searchable prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          searchable: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts disabled prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          disabled: true
        }
      })

      expect(wrapper.find('.vue-treeselect__control').attributes('data-disabled')).toBe('true')
    })

    it('accepts clearable prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          clearable: false
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts required prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          required: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts alwaysOpen prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          alwaysOpen: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts appendToBody prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          appendToBody: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts async prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          async: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts disableBranchNodes prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          disableBranchNodes: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts disableFuzzyMatching prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          disableFuzzyMatching: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts flat prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          flat: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts openOnClick prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          openOnClick: false
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts openOnFocus prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          openOnFocus: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts searchNested prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          searchNested: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts showCount prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          showCount: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('String Props', () => {
    it('accepts placeholder prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          placeholder: 'Custom placeholder'
        }
      })

      expect(wrapper.find('.vue-treeselect__placeholder').text()).toBe('Custom placeholder')
    })

    it('accepts name prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          name: 'treeselect-input'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts noChildrenText prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          noChildrenText: 'No children'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts noOptionsText prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          noOptionsText: 'No options'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts noResultsText prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          noResultsText: 'No results'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts searchPromptText prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          searchPromptText: 'Type to search...'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts loadingText prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          loadingText: 'Loading data...'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts clearValueText prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          clearValueText: 'Clear selection'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts clearAllText prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          clearAllText: 'Clear all selections'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts retryText prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          retryText: 'Try again'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts retryTitle prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          retryTitle: 'Click to retry loading'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts delimiter prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          delimiter: '|'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts openDirection prop with valid value', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          openDirection: 'bottom'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts valueFormat prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          valueFormat: 'object'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts valueConsistsOf prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          valueConsistsOf: 'ALL'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts showCountOf prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          showCountOf: 'ALL_CHILDREN'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts sortValueBy prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          sortValueBy: 'LEVEL'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Number Props', () => {
    it('accepts maxHeight prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          maxHeight: 400
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts zIndex prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          zIndex: 1000
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts tabIndex prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          tabIndex: 1
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts limit prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          limit: 5
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts defaultExpandLevel prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          defaultExpandLevel: 2
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts instanceId prop', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          instanceId: 'my-treeselect'
        }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Function Props', () => {
    it('accepts limitText prop as function', () => {
      const limitText = (count: number) => `${count} more items`

      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          limit: 2,
          limitText
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts normalizer prop as function', () => {
      const normalizer = (node: any) => ({
        id: node.id,
        label: node.name,
        children: node.children
      })

      const wrapper = mount(Treeselect, {
        props: {
          options: [
            { id: 1, name: 'Option 1' }
          ],
          normalizer
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts loadOptions prop as function', () => {
      const loadOptions = ({ action, callback }: any) => {
        if (action === 'LOAD_CHILDREN_OPTIONS') {
          callback()
        }
      }

      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          loadOptions
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts beforeClearAll prop as function', () => {
      const beforeClearAll = () => {
        return confirm('Are you sure you want to clear all?')
      }

      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          beforeClearAll
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    describe('beforeClearAll interaction', () => {
      const options = [
        { id: 'a', label: 'Option A' },
        { id: 'b', label: 'Option B' },
      ]

      async function mountWithBeforeClearAll(
        beforeClearAll?: () => boolean | Promise<boolean>,
      ) {
        const wrapper = mount(Treeselect, {
          props: {
            options,
            multiple: true,
            modelValue: ['a'],
            clearable: true,
            ...(beforeClearAll ? { beforeClearAll } : {}),
          },
          attachTo: document.body,
        })
        await nextTick()
        return wrapper
      }

      it('calls beforeClearAll when clicking x button', async () => {
        const fn = vi.fn(() => true)
        const wrapper = await mountWithBeforeClearAll(fn)

        wrapper.find('.vue-treeselect__x-container').trigger('mousedown')
        await nextTick()

        expect(fn).toHaveBeenCalledTimes(1)
        wrapper.unmount()
      })

      it('prevents clearing when beforeClearAll returns false', async () => {
        const wrapper = await mountWithBeforeClearAll(() => false)
        expect(wrapper.vm.getSelectedNodes().length).toBe(1)

        wrapper.find('.vue-treeselect__x-container').trigger('mousedown')
        await nextTick()

        expect(wrapper.vm.getSelectedNodes().length).toBe(1)
        wrapper.unmount()
      })

      it('allows clearing when beforeClearAll returns true', async () => {
        const wrapper = await mountWithBeforeClearAll(() => true)
        expect(wrapper.vm.getSelectedNodes().length).toBe(1)

        wrapper.find('.vue-treeselect__x-container').trigger('mousedown')
        await new Promise((r) => setTimeout(r, 10)) // setTimeout(0) in sync path

        expect(wrapper.vm.getSelectedNodes().length).toBe(0)
        wrapper.unmount()
      })

      it('prevents clearing when beforeClearAll resolves to false (async)', async () => {
        const wrapper = await mountWithBeforeClearAll(
          () => Promise.resolve(false),
        )
        expect(wrapper.vm.getSelectedNodes().length).toBe(1)

        wrapper.find('.vue-treeselect__x-container').trigger('mousedown')
        await nextTick()

        expect(wrapper.vm.getSelectedNodes().length).toBe(1)
        wrapper.unmount()
      })

      it('allows clearing when beforeClearAll resolves to true (async)', async () => {
        const wrapper = await mountWithBeforeClearAll(
          () => Promise.resolve(true),
        )
        expect(wrapper.vm.getSelectedNodes().length).toBe(1)

        wrapper.find('.vue-treeselect__x-container').trigger('mousedown')
        await nextTick()

        expect(wrapper.vm.getSelectedNodes().length).toBe(0)
        wrapper.unmount()
      })
    })
  })

  describe('Array Props', () => {
    it('accepts options prop as array', () => {
      const options = [
        { id: 'a', label: 'Option A' },
        { id: 'b', label: 'Option B' }
      ]

      const wrapper = mount(Treeselect, {
        props: {
          options
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts options prop with nested children', () => {
      const options = [
        {
          id: 'a',
          label: 'Parent A',
          children: [
            { id: 'a1', label: 'Child A1' },
            { id: 'a2', label: 'Child A2' }
          ]
        }
      ]

      const wrapper = mount(Treeselect, {
        props: {
          options
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts matchKeys prop as array', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          matchKeys: ['label', 'customField']
        }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Value Props', () => {
    it('accepts modelValue prop as string', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [
            { id: 'a', label: 'Option A' }
          ],
          modelValue: 'a'
        }
      })

      expect(wrapper.find('.vue-treeselect__single-value').text()).toBe('Option A')
    })

    it('accepts modelValue prop as number', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [
            { id: 1, label: 'Option 1' }
          ],
          modelValue: 1
        }
      })

      expect(wrapper.find('.vue-treeselect__single-value').text()).toBe('Option 1')
    })

    it('accepts modelValue prop as array for multi-select', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [
            { id: 'a', label: 'Option A' },
            { id: 'b', label: 'Option B' }
          ],
          modelValue: ['a', 'b'],
          multiple: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('accepts modelValue prop as null', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          modelValue: null
        }
      })

      expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
    })

    it('accepts modelValue prop as undefined', () => {
      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          modelValue: undefined
        }
      })

      expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
    })
  })
})
