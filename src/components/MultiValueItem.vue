<script setup lang="ts">
import { inject, computed, type ComputedRef } from 'vue'

import type { TreeselectNode, TreeselectInstance } from '../types'
import { TRESELECT_INSTANCE_KEY } from '../types'

// Import Delete icon
import DeleteIcon from './icons/Delete.vue'

// Import SCSS styles
// @ts-ignore - SCSS import
import '../styles/index.scss'

// Props
interface Props {
  node: TreeselectNode
}

const props = defineProps<Props>()

// Inject the treeselect instance
const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)

if (!instanceRef) {
  throw new Error('MultiValueItem must be used within a Treeselect component')
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

// Type assertion: instance is definitely defined after the check above
const treeselectInstance = instance

// Get slots
const slots = defineSlots<{
  'value-label'?: (props: { node: TreeselectNode }) => any
}>()

// CSS classes for the item
const itemClass = computed(() => ({
  'vue-treeselect__multi-value-item': true,
  'vue-treeselect__multi-value-item-disabled': props.node.isDisabled,
  'vue-treeselect__multi-value-item-new': props.node.isNew,
}))

// Render label
function renderLabel() {
  const customValueLabelRenderer = slots['value-label']
  return customValueLabelRenderer
    ? customValueLabelRenderer({ node: props.node })
    : props.node.label
}

// Handle click to deselect
function handleMouseDown(event: MouseEvent) {
  // Only handle left mouse button
  if (event.button !== 0) return

  event.preventDefault()
  event.stopPropagation()

  // Deselect this node
  treeselectInstance.value.select(props.node)
}
</script>

<template>
  <div class="vue-treeselect__multi-value-item-container">
    <div :class="itemClass" @mousedown="handleMouseDown">
      <span class="vue-treeselect__multi-value-label">
        {{ renderLabel() }}
      </span>
      <span class="vue-treeselect__icon vue-treeselect__value-remove">
        <DeleteIcon />
      </span>
    </div>
  </div>
</template>
