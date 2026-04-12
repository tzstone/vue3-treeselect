import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Treeselect from '../src/components/Treeselect.vue'

describe('Basic Rendering', () => {
  it('mounts without errors', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: []
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect').exists()).toBe(true)
  })

  it('renders with default placeholder when no value', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: []
      }
    })

    expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect__placeholder').text()).toBe('Select...')
  })

  it('renders with custom placeholder', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [],
        placeholder: 'Choose an option...'
      }
    })

    expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect__placeholder').text()).toBe('Choose an option...')
  })

  it('shows selected value in single-select mode', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [
          { id: 'a', label: 'Option A' },
          { id: 'b', label: 'Option B' }
        ],
        modelValue: 'a'
      }
    })

    expect(wrapper.find('.vue-treeselect__single-value').exists()).toBe(true)
    expect(wrapper.find('.vue-treeselect__single-value').text()).toBe('Option A')
  })

  it('shows no placeholder when value is selected', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [
          { id: 'a', label: 'Option A' }
        ],
        modelValue: 'a'
      }
    })

    expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(false)
    expect(wrapper.find('.vue-treeselect__single-value').exists()).toBe(true)
  })

  it('shows no value when multiple values are selected but not displayed', () => {
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

    expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(false)
  })

  it('renders clear button when value is selected and clearable is true', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [
          { id: 'a', label: 'Option A' }
        ],
        modelValue: 'a',
        clearable: true
      }
    })

    expect(wrapper.find('.vue-treeselect__x-container').exists()).toBe(true)
  })

  it('does not render clear button when clearable is false', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [
          { id: 'a', label: 'Option A' }
        ],
        modelValue: 'a',
        clearable: false
      }
    })

    expect(wrapper.find('.vue-treeselect__x-container').exists()).toBe(false)
  })

  it('renders arrow button', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: []
      }
    })

    expect(wrapper.find('.vue-treeselect__control-arrow-container').exists()).toBe(true)
  })

  it('adds disabled class when disabled prop is true', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [],
        disabled: true
      }
    })

    expect(wrapper.find('.vue-treeselect__control').attributes('data-disabled')).toBe('true')
  })

  it('does not add disabled class when disabled prop is false', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [],
        disabled: false
      }
    })

    expect(wrapper.find('.vue-treeselect__control').attributes('data-disabled')).toBe('false')
  })

  it('does not add open class when menu is closed', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: []
      }
    })

    expect(wrapper.find('.vue-treeselect__control').attributes('data-open')).toBe('false')
  })

  it('does not render input field when searchable is false', () => {
    const wrapper = mount(Treeselect, {
      props: {
        options: [],
        searchable: false
      }
    })

    expect(wrapper.find('input[type="text"]').exists()).toBe(false)
  })
})
