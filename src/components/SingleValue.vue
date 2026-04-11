<script setup lang="ts">
import { inject, computed, type ComputedRef } from 'vue'

import type { TreeselectInstance } from '../types'
import { TRESELECT_INSTANCE_KEY } from '../types'

// Import SCSS styles
// @ts-ignore - SCSS import
import '../styles/index.scss'

// Inject the treeselect instance
const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)

if (!instanceRef) {
  throw new Error('SingleValue must be used within a Treeselect component')
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

// Computed: Whether to show the value
const shouldShowValue = computed(() => {
  return instance.value.hasValue && !instance.value.searchQuery
})

// Computed: Selected node (first for single-select mode)
const selectedNode = computed(() => {
  return instance.value.selectedNodes[0]
})

// Get slots
const slots = defineSlots<{
  'value-label'?: (props: { node: typeof selectedNode.value }) => any
}>()

// Render single value label
function renderSingleValueLabel() {
  const node = selectedNode.value
  if (!node) return null

  const customValueLabelRenderer = slots['value-label']
  return customValueLabelRenderer
    ? customValueLabelRenderer({ node })
    : node.label
}
</script>

<template>
  <div v-if="shouldShowValue" class="vue-treeselect__single-value">
    {{ renderSingleValueLabel() }}
  </div>
</template>
