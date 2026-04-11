import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Treeselect from '../src/components/Treeselect.vue'

describe('Task 7: Treeselect Root Component', () => {
  it('should mount without errors', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [],
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect').exists()).toBe(true)
  })

  it('should accept all props without warnings', () => {
    const wrapper = mount(Treeselect, {
      props: {
        multiple: true,
        searchable: true,
        placeholder: 'Select something',
        disabled: false,
        clearable: true,
        options: [
          { id: 'a', label: 'Option A' },
          { id: 'b', label: 'Option B' },
        ],
      },
    })

    expect(wrapper.props('multiple')).toBe(true)
    expect(wrapper.props('searchable')).toBe(true)
    expect(wrapper.props('placeholder')).toBe('Select something')
  })

  it('should expose public methods via template ref', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [],
      },
    })

    const vm = wrapper.vm as any
    expect(typeof vm.openMenu).toBe('function')
    expect(typeof vm.closeMenu).toBe('function')
    expect(typeof vm.clear).toBe('function')
    expect(typeof vm.focusInput).toBe('function')
    expect(typeof vm.blurInput).toBe('function')
    expect(typeof vm.getSelectedNodes).toBe('function')
    expect(typeof vm.getNode).toBe('function')
    expect(typeof vm.isSelected).toBe('function')
    expect(typeof vm.toggleExpanded).toBe('function')
    expect(typeof vm.select).toBe('function')
    expect(typeof vm.loadChildrenOptions).toBe('function')
  })

  it('should apply correct wrapper classes based on props', () => {
    const wrapper = mount(Treeselect, {
      props: {
        multiple: true,
        searchable: true,
        disabled: false,
        options: [],
      },
    })

    const root = wrapper.find('.vue-treeselect')
    expect(root.classes()).toContain('vue-treeselect--multi')
    expect(root.classes()).toContain('vue-treeselect--searchable')
    expect(root.classes()).not.toContain('vue-treeselect--disabled')
  })
})
