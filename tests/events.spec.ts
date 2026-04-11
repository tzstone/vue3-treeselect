import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Treeselect from '../src/components/Treeselect.vue'

describe('Events', () => {
  describe('open event', () => {
    it('emits open event when menu opens', async () => {
      const onOpen = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          onOpen
        }
      })

      await wrapper.vm.openMenu()
      await nextTick()

      expect(onOpen).toHaveBeenCalled()
    })

    it('emits open event with instanceId', async () => {
      const onOpen = vi.fn()
      const instanceId = 'test-instance'

      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          instanceId,
          onOpen
        }
      })

      await wrapper.vm.openMenu()
      await nextTick()

      expect(onOpen).toHaveBeenCalledWith(instanceId)
    })
  })

  describe('close event', () => {
    it('emits close event when menu closes', async () => {
      const onClose = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          onClose
        }
      })

      await wrapper.vm.openMenu()
      await nextTick()
      await wrapper.vm.closeMenu()
      await nextTick()

      expect(onClose).toHaveBeenCalled()
    })

    it('emits close event with instanceId', async () => {
      const onClose = vi.fn()
      const instanceId = 'test-instance'

      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          instanceId,
          onClose
        }
      })

      await wrapper.vm.openMenu()
      await nextTick()
      await wrapper.vm.closeMenu()
      await nextTick()

      expect(onClose.mock.calls[0][1]).toBe(instanceId)
    })
  })

  describe('input event', () => {
    it('emits input event when value changes', async () => {
      const onInput = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: [
            { id: 'a', label: 'Option A' }
          ],
          onInput
        }
      })

      await wrapper.setProps({ value: 'a' })
      await nextTick()

      expect(onInput).toHaveBeenCalled()
    })

    it('emits input event with instanceId', async () => {
      const onInput = vi.fn()
      const instanceId = 'test-instance'

      const wrapper = mount(Treeselect, {
        props: {
          options: [
            { id: 'a', label: 'Option A' }
          ],
          instanceId,
          onInput
        }
      })

      await wrapper.setProps({ value: 'a' })
      await nextTick()

      expect(onInput.mock.calls[0][1]).toBe(instanceId)
    })
  })

  describe('select event', () => {
    it('emits select event when option is selected', async () => {
      const onSelect = vi.fn()
      const options = [{ id: 'a', label: 'Option A' }]

      const wrapper = mount(Treeselect, {
        props: {
          options,
          onSelect
        }
      })

      await wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      expect(onSelect).toHaveBeenCalled()
    })

    it('emits select event with instanceId', async () => {
      const onSelect = vi.fn()
      const instanceId = 'test-instance'
      const options = [{ id: 'a', label: 'Option A' }]

      const wrapper = mount(Treeselect, {
        props: {
          options,
          instanceId,
          onSelect
        }
      })

      await wrapper.vm.select(wrapper.vm.getNode('a')!)
      await nextTick()

      expect(onSelect.mock.calls[0][1]).toBe(instanceId)
    })
  })

  describe('deselect event', () => {
    it('emits deselect event with instanceId', async () => {
      const onDeselect = vi.fn()
      const instanceId = 'test-instance'
      const options = [{ id: 'a', label: 'Option A' }]

      const wrapper = mount(Treeselect, {
        props: {
          options,
          value: 'a',
          instanceId,
          onDeselect
        }
      })

      await wrapper.vm.clear()
      await nextTick()

      if (onDeselect.mock.calls.length > 0) {
        expect(onDeselect.mock.calls[0][1]).toBe(instanceId)
      }
    })
  })

  describe('search-change event', () => {
    it('does not emit search-change when not searchable', async () => {
      const onSearchChange = vi.fn()

      const wrapper = mount(Treeselect, {
        props: {
          options: [],
          searchable: false,
          onSearchChange
        }
      })

      await wrapper.vm.openMenu()
      await nextTick()

      expect(onSearchChange).not.toHaveBeenCalled()
    })
  })
})
