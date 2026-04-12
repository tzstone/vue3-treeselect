<template>
  <div class="vue-treeselect__input-container" v-bind="containerProps">
    <input
      v-if="searchable && !disabled"
      ref="inputRef"
      class="vue-treeselect__input"
      type="text"
      autocomplete="off"
      :tabindex="tabIndex"
      :required="required && !hasValue"
      :value="inputValue"
      :style="inputStyle"
      @focus="onFocus"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeyDown"
      @mousedown="onMouseDown"
    />
    <div
      v-if="needAutoSize"
      ref="sizerRef"
      class="vue-treeselect__sizer"
    >
      {{ inputValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, inject, type ComputedRef } from 'vue'
import { debounce, includes } from '../utils'
import { MIN_INPUT_WIDTH, KEY_CODES, INPUT_DEBOUNCE_DELAY } from '../constants'
import { TRESELECT_INSTANCE_KEY, type TreeselectInstance } from '../types'

const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)

if (!instanceRef) {
  throw new Error('Input must be used within a Treeselect component')
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

const instanceNonNull = instance

// Props from instance
const searchable = computed(() => (instanceNonNull.value as any).searchable !== false)
const disabled = computed(() => (instanceNonNull.value as any).disabled)
const multiple = computed(() => (instanceNonNull.value as any).multiple)
const tabIndex = computed(() => (instanceNonNull.value as any).tabIndex ?? 0)
const required = computed(() => (instanceNonNull.value as any).required || false)
const hasValue = computed(() => instanceNonNull.value.hasValue)
const backspaceRemoves = computed(() => (instanceNonNull.value as any).backspaceRemoves !== false)
const deleteRemoves = computed(() => (instanceNonNull.value as any).deleteRemoves !== false)
const disableBranchNodes = computed(() => (instanceNonNull.value as any).disableBranchNodes)
const openOnFocus = computed(() => (instanceNonNull.value as any).openOnFocus)

// Template refs
const inputRef = ref<HTMLInputElement | null>(null)
const sizerRef = ref<HTMLElement | null>(null)

// State
const inputWidth = ref(MIN_INPUT_WIDTH)
const inputValue = ref(instanceNonNull.value.trigger.searchQuery)

// Computed
const needAutoSize = computed(() => {
  return (
    searchable.value &&
    !disabled.value &&
    multiple.value
  )
})

const inputStyle = computed(() => {
  return {
    width: needAutoSize.value ? `${inputWidth.value}px` : undefined,
  }
})

const containerProps = computed(() => {
  const props: Record<string, unknown> = {}

  if (!searchable.value) {
    props.onFocus = onFocus
    props.onBlur = onBlur
    props.onKeydown = onKeyDown
  }

  if (!searchable.value && !disabled.value) {
    props.tabIndex = tabIndex.value
  }

  return props
})

// Methods
function clear() {
  onInput({ target: { value: '' } } as unknown as Event)
}

function focus() {
  if (!disabled.value && inputRef.value) {
    inputRef.value.focus()
  }
}

function blur() {
  if (inputRef.value) {
    inputRef.value.blur()
  }
}

function onFocus() {
  instanceNonNull.value.trigger.isFocused = true
  if (openOnFocus.value) {
    instanceNonNull.value.openMenu()
  }
}

function onBlur() {
  instanceNonNull.value.trigger.isFocused = false
  instanceNonNull.value.closeMenu()
}

// Set up debounced callback
const debouncedUpdateSearchQuery = debounce(
  updateSearchQuery,
  INPUT_DEBOUNCE_DELAY,
)

function onInput(evt: Event) {
  const target = evt.target as HTMLInputElement
  const value = target.value

  inputValue.value = value

  if (value) {
    debouncedUpdateSearchQuery()
  } else {
    debouncedUpdateSearchQuery.cancel()
    updateSearchQuery()
  }
}

function onKeyDown(evt: KeyboardEvent) {
  const key = evt.which || evt.keyCode

  if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey)
    return

  const keysThatRequireMenuBeingOpen = [
    KEY_CODES.ENTER,
    KEY_CODES.END,
    KEY_CODES.HOME,
    KEY_CODES.ARROW_LEFT,
    KEY_CODES.ARROW_UP,
    KEY_CODES.ARROW_RIGHT,
    KEY_CODES.ARROW_DOWN,
  ]

  if (!instanceNonNull.value.menuIsOpen && includes(keysThatRequireMenuBeingOpen, key)) {
    evt.preventDefault()
    instanceNonNull.value.openMenu()
    return
  }

  switch (key) {
    case KEY_CODES.BACKSPACE: {
      if (backspaceRemoves.value && !inputValue.value.length) {
        instanceNonNull.value.removeLastValue()
      }
      break
    }
    case KEY_CODES.ENTER: {
      evt.preventDefault()
      const currentId = instanceNonNull.value.currentHighlightedOptionId
      if (currentId === null) return
      const current = instanceNonNull.value.getNode(currentId)
      if (!current) return
      if (current.isBranch && disableBranchNodes.value) return
      instanceNonNull.value.select(current)
      break
    }
    case KEY_CODES.ESCAPE: {
      if (inputValue.value.length) {
        clear()
      } else if (instanceNonNull.value.menuIsOpen) {
        instanceNonNull.value.closeMenu()
      }
      break
    }
    case KEY_CODES.END: {
      evt.preventDefault()
      if ((instanceNonNull.value as any).highlightLastOption) {
        ;(instanceNonNull.value as any).highlightLastOption()
      }
      break
    }
    case KEY_CODES.HOME: {
      evt.preventDefault()
      if ((instanceNonNull.value as any).highlightFirstOption) {
        ;(instanceNonNull.value as any).highlightFirstOption()
      }
      break
    }
    case KEY_CODES.ARROW_LEFT: {
      const currentId = instanceNonNull.value.currentHighlightedOptionId
      const current = currentId !== null ? instanceNonNull.value.getNode(currentId) : null
      if (current && current.isBranch && (instanceNonNull.value as any).shouldExpand?.(current)) {
        evt.preventDefault()
        instanceNonNull.value.toggleExpanded(current)
      } else if (current && !current.isRootNode && (current.isLeaf || (current.isBranch && !(instanceNonNull.value as any).shouldExpand?.(current)))) {
        evt.preventDefault()
        if ((instanceNonNull.value as any).setCurrentHighlightedOption && current.parentNode) {
          ;(instanceNonNull.value as any).setCurrentHighlightedOption(current.parentNode)
        }
      }
      break
    }
    case KEY_CODES.ARROW_UP: {
      evt.preventDefault()
      if ((instanceNonNull.value as any).highlightPrevOption) {
        ;(instanceNonNull.value as any).highlightPrevOption()
      }
      break
    }
    case KEY_CODES.ARROW_RIGHT: {
      const currentId = instanceNonNull.value.currentHighlightedOptionId
      const current = currentId !== null ? instanceNonNull.value.getNode(currentId) : null
      if (current && current.isBranch && !(instanceNonNull.value as any).shouldExpand?.(current)) {
        evt.preventDefault()
        instanceNonNull.value.toggleExpanded(current)
      }
      break
    }
    case KEY_CODES.ARROW_DOWN: {
      evt.preventDefault()
      if ((instanceNonNull.value as any).highlightNextOption) {
        ;(instanceNonNull.value as any).highlightNextOption()
      }
      break
    }
    case KEY_CODES.DELETE: {
      if (deleteRemoves.value && !inputValue.value.length) {
        instanceNonNull.value.removeLastValue()
      }
      break
    }
    default: {
      instanceNonNull.value.openMenu()
    }
  }
}

function onMouseDown(evt: MouseEvent) {
  if (inputValue.value.length) {
    // Prevent it from bubbling to the top level and triggering `preventDefault()`
    // to make the textbox unselectable
    evt.stopPropagation()
  }
}

function updateInputWidth() {
  if (sizerRef.value) {
    inputWidth.value = Math.max(
      MIN_INPUT_WIDTH,
      sizerRef.value.scrollWidth + 15,
    )
  }
}

function updateSearchQuery() {
  instanceNonNull.value.trigger.searchQuery = inputValue.value
}

// Watchers
watch(() => instanceNonNull.value.trigger.searchQuery, (newValue) => {
  inputValue.value = newValue
})

watch(inputValue, () => {
  if (needAutoSize.value) {
    nextTick(updateInputWidth)
  }
})

// Lifecycle
onMounted(() => {
  if ((instanceNonNull.value as any).autoFocus) {
    focus()
  }
})

// Expose methods
defineExpose({
  clear,
  focus,
  blur,
})
</script>
