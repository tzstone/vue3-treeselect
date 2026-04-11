import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp, h, provide, InjectionKey, ref, computed } from 'vue'
import Treeselect from '../src/components/Treeselect.vue'
import Control from '../src/components/Control.vue'
import Placeholder from '../src/components/Placeholder.vue'
import Input from '../src/components/Input.vue'
import type { TreeselectInstance } from '../src/types'
import { TRESELECT_INSTANCE_KEY } from '../src/types'

function createMockInstance(overrides: Partial<TreeselectInstance> = {}): TreeselectInstance {
  const trigger = ref({ isFocused: false, searchQuery: '' })
  return {
    isFocused: false,
    searchQuery: '',
    menuIsOpen: false,
    currentHighlightedOptionId: null,
    selectedNodes: [],
    hasValue: false,
    single: true,
    multiple: false,
    hasBranchNodes: false,
    disabled: false,
    clearable: true,
    allowClearingDisabled: false,
    alwaysOpen: false,
    clearAllText: 'Clear all',
    clearValueText: 'Clear value',
    placeholder: 'Select...',
    trigger: trigger.value,
    openOnFocus: false,
    tabIndex: 0,
    required: false,
    backspaceRemoves: true,
    deleteRemoves: true,
    disableBranchNodes: false,
    autoFocus: false,
    searchable: true,
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
    removeLastValue: vi.fn(),
    shouldExpand: vi.fn(() => false),
    highlightLastOption: vi.fn(),
    highlightFirstOption: vi.fn(),
    highlightPrevOption: vi.fn(),
    highlightNextOption: vi.fn(),
    setCurrentHighlightedOption: vi.fn(),
    handleMouseDown: vi.fn(),
    ...overrides,
  }
}

describe('Task 8: Control + Placeholder + Input Components', () => {
  describe('Control component', () => {
    it('should render correctly in single mode', async () => {
      const mockInstance = createMockInstance({
        single: true,
        multiple: false,
        hasValue: false,
      })

      const TestWrapper1 = {
        template: '<Control />',
        components: { Control },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper1)

      expect(wrapper.find('.vue-treeselect__control').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__input').exists()).toBe(false)
      expect(wrapper.find('.vue-treeselect__x-container').exists()).toBe(false)
    })

    it('should render correctly in multi mode', async () => {
      const mockInstance = createMockInstance({
        single: false,
        multiple: true,
        hasValue: false,
      })

      const TestWrapper = {
        template: '<Control />',
        components: { Control },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      expect(wrapper.find('.vue-treeselect__control').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
    })

    it('should show X button when clearable and hasValue', async () => {
      const mockInstance = createMockInstance({
        hasValue: true,
        selectedNodes: [
          { id: '1', label: 'Option 1' } as any,
        ],
      })

      const TestWrapper = {
        template: '<Control />',
        components: { Control },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      expect(wrapper.find('.vue-treeselect__x-container').exists()).toBe(true)
    })

    it('should show arrow button', async () => {
      const mockInstance = createMockInstance({
        menuIsOpen: false,
      })

      const TestWrapper = {
        template: '<Control />',
        components: { Control },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      expect(wrapper.find('.vue-treeselect__control-arrow-container').exists()).toBe(true)
    })

    it('should rotate arrow when menu is open', async () => {
      const mockInstance = createMockInstance({
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Control />',
        components: { Control },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const arrow = wrapper.find('.vue-treeselect__control-arrow')
      expect(arrow.exists()).toBe(true)
      expect(arrow.classes()).toContain('vue-treeselect__control-arrow--rotated')
    })
  })

  describe('Placeholder component', () => {
    it('should render placeholder text', async () => {
      const mockInstance = createMockInstance({
        placeholder: 'Select an option...',
        hasValue: false,
        searchQuery: '',
      })

      const TestWrapper = {
        template: '<Placeholder />',
        components: { Placeholder },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.exists()).toBe(true)
      expect(placeholder.text()).toBe('Select an option...')
    })

    it('should be hidden when hasValue is true', async () => {
      const mockInstance = createMockInstance({
        placeholder: 'Select an option...',
        hasValue: true,
        searchQuery: '',
      })

      const TestWrapper = {
        template: '<Placeholder />',
        components: { Placeholder },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.classes()).toContain('vue-treeselect-helper-hide')
    })

    it('should be hidden when searchQuery is not empty', async () => {
      const mockInstance = createMockInstance({
        placeholder: 'Select an option...',
        hasValue: false,
        searchQuery: 'test',
      })

      const TestWrapper = {
        template: '<Placeholder />',
        components: { Placeholder },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const placeholder = wrapper.find('.vue-treeselect__placeholder')
      expect(placeholder.classes()).toContain('vue-treeselect-helper-hide')
    })
  })

  describe('Input component', () => {
    it('should render input when searchable and menuIsOpen', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(true)
    })

    it('should not render input when not searchable', async () => {
      const mockInstance = createMockInstance({
        searchable: false,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(false)
    })

    it('should not render input when disabled', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: true,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      expect(input.exists()).toBe(false)
    })

    it('should handle input events with debouncing', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.setValue('test')

      await new Promise(resolve => setTimeout(resolve, 250))

      expect(mockInstance.searchQuery).toBe('test')
    })

    it('should handle keyboard events - BACKSPACE removes last value', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        multiple: true,
        backspaceRemoves: true,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.setValue('')
      await input.trigger('keydown', { keyCode: 8 })

      expect(mockInstance.removeLastValue).toHaveBeenCalled()
    })

    it('should handle keyboard events - ENTER selects option', async () => {
      const mockNode = { id: '1', label: 'Option 1', isBranch: false, isLeaf: true } as any
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
        currentHighlightedOptionId: '1',
        getNode: vi.fn(() => mockNode),
        select: vi.fn(),
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.trigger('keydown', { keyCode: 13 })

      expect(mockInstance.select).toHaveBeenCalledWith(mockNode)
    })

    it('should handle keyboard events - ESCAPE clears input', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.setValue('test')
      await input.trigger('keydown', { keyCode: 27 })

      expect(wrapper.find('.vue-treeselect__input').element.value).toBe('')
    })

    it('should handle keyboard events - ARROW_DOWN highlights next option', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
        highlightNextOption: vi.fn(),
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.trigger('keydown', { keyCode: 40 })

      expect(mockInstance.highlightNextOption).toHaveBeenCalled()
    })

    it('should handle keyboard events - ARROW_UP highlights previous option', async () => {
      const mockInstance = createMockInstance({
        searchable: true,
        disabled: false,
        menuIsOpen: true,
        highlightPrevOption: vi.fn(),
      })

      const TestWrapper = {
        template: '<Input />',
        components: { Input },
        setup() {
          provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
          return {}
        },
      }

      const wrapper = mount(TestWrapper)

      const input = wrapper.find('.vue-treeselect__input')
      await input.trigger('keydown', { keyCode: 38 })

      expect(mockInstance.highlightPrevOption).toHaveBeenCalled()
    })
  })

  describe('Treeselect with Control component', () => {
    it('should mount with Control component', async () => {
      const options = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
      ]

      const wrapper = mount(Treeselect, {
        props: {
          options,
          multiple: false,
        },
      })

      expect(wrapper.find('.vue-treeselect__control').exists()).toBe(true)
    })

    it('should show placeholder when no value is selected', async () => {
      const options = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
      ]

      const wrapper = mount(Treeselect, {
        props: {
          options,
          multiple: false,
          placeholder: 'Select an option...',
        },
      })

      expect(wrapper.find('.vue-treeselect__placeholder').exists()).toBe(true)
      expect(wrapper.find('.vue-treeselect__placeholder').text()).toBe('Select an option...')
    })
  })
})
