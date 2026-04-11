<template>
  <div
    ref="rootElement"
    class="vue-treeselect__control"
    :data-disabled="instanceNonNull.disabled"
    :data-open="instanceNonNull.menuIsOpen"
    @mousedown="handleMouseDown"
  >
    <div class="vue-treeselect__value-container">
      <SingleValue v-if="instanceNonNull.single && instanceNonNull.hasValue" />
      <MultiValue v-if="!instanceNonNull.single && instanceNonNull.hasValue" />

      <Placeholder v-if="!instanceNonNull.hasValue" />

      <Input v-if="instanceNonNull.searchable && instanceNonNull.menuIsOpen" />
    </div>

    <div
      v-if="shouldShowX"
      class="vue-treeselect__x-container"
      :title="clearTitle"
      @mousedown="handleMouseDownOnX"
    >
      <DeleteIcon class="vue-treeselect__x" />
    </div>

    <div
      v-if="shouldShowArrow"
      class="vue-treeselect__control-arrow-container"
      @mousedown="handleMouseDownOnArrow"
    >
      <ArrowIcon :class="arrowClass" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, type ComputedRef } from 'vue'
import { isPromise } from '../utils'
import DeleteIcon from './icons/Delete.vue'
import ArrowIcon from './icons/Arrow.vue'
import SingleValue from './SingleValue.vue'
import MultiValue from './MultiValue.vue'
import Placeholder from './Placeholder.vue'
import Input from './Input.vue'
import { TRESELECT_INSTANCE_KEY, type TreeselectInstance } from '../types'

const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)

if (!instanceRef) {
  throw new Error('Control must be used within a Treeselect component')
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

// Expose instance to template
const instanceNonNull = instance

// Root element reference
const rootElement = ref<HTMLElement | null>(null)

// Expose root DOM element and instance to parent
defineExpose({
  rootElement,
  instance: instanceNonNull
})

// Computed properties
const shouldShowX = computed(() => {
  const hasUndisabledValue = instanceNonNull.value.selectedNodes.some(node => !node.isDisabled)

  return (
    (instanceNonNull.value as any).clearable !== false &&
    !(instanceNonNull.value as any).disabled &&
    instanceNonNull.value.hasValue &&
    (hasUndisabledValue || (instanceNonNull.value as any).allowClearingDisabled)
  )
})

const shouldShowArrow = computed(() => {
  const alwaysOpen = (instanceNonNull.value as any).alwaysOpen
  if (!alwaysOpen) return true
  return !instanceNonNull.value.menuIsOpen
})

const arrowClass = computed(() => ({
  'vue-treeselect__control-arrow': true,
  'vue-treeselect__control-arrow--rotated': instanceNonNull.value.menuIsOpen,
}))

const clearTitle = computed(() => {
  return (instanceNonNull.value as any).multiple
    ? ((instanceNonNull.value as any).clearAllText || 'Clear all')
    : ((instanceNonNull.value as any).clearValueText || 'Clear value')
})

// Event handlers
async function handleMouseDownOnX(evt: MouseEvent) {
  evt.stopPropagation()
  evt.preventDefault()

  const beforeClearAll = (instanceNonNull.value as any).beforeClearAll
  if (!beforeClearAll) {
    instanceNonNull.value.clear()
    return
  }

  const result = beforeClearAll()
  const handler = (shouldClear: boolean) => {
    if (shouldClear) instanceNonNull.value.clear()
  }

  if (isPromise(result)) {
    await result
    handler(true)
  } else {
    setTimeout(() => handler(result), 0)
  }
}

function handleMouseDownOnArrow(evt: MouseEvent) {
  evt.preventDefault()
  evt.stopPropagation()

  instanceNonNull.value.focusInput()
  instanceNonNull.value.toggleMenu()
}

function handleMouseDown(evt: MouseEvent) {
  // This is called by the parent Treeselect component
  // We're not implementing it here as it's handled by the parent
  // But we can delegate to the instance if needed
  if ((instanceNonNull.value as any).handleMouseDown) {
    (instanceNonNull.value as any).handleMouseDown(evt)
  }
}
</script>
