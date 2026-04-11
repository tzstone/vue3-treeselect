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
      trigger: { isFocused: false, searchQuery: '' } as any,
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
