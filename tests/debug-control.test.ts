import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { provide, computed } from 'vue'
import Control from '../src/components/Control.vue'
import type { TreeselectInstance } from '../src/types'
import { TRESELECT_INSTANCE_KEY } from '../src/types'

function createMockInstance(overrides: Partial<TreeselectInstance> = {}): TreeselectInstance {
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
    trigger: { isFocused: false, searchQuery: '' } as any,
    openOnFocus: false,
    tabIndex: 0,
    required: false,
    backspaceRemoves: true,
    deleteRemoves: true,
    disableBranchNodes: false,
    autoFocus: false,
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

describe('Task 8: Control component debugging', () => {
  it('should mount without errors', async () => {
    const mockInstance = createMockInstance()

    const TestWrapper = {
      template: '<Control />',
      components: { Control },
      setup() {
        provide(TRESELECT_INSTANCE_KEY, computed(() => mockInstance))
        return {}
      },
    }

    const wrapper = mount(TestWrapper)
    expect(wrapper.exists()).toBe(true)
    console.log('Wrapper HTML:', wrapper.html())
  })
})
