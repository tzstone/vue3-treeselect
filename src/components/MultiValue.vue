<script setup lang="ts">
import { inject, computed, ref, type ComputedRef } from 'vue'

import type { TreeselectNode, TreeselectInstance } from '../types'
import { TRESELECT_INSTANCE_KEY } from '../types'

// Import components
import MultiValueItem from './MultiValueItem.vue'
import Input from './Input.vue'
import Placeholder from './Placeholder.vue'

// Import SCSS styles
// @ts-ignore - SCSS import
import '../styles/index.scss'

// Extended instance type with limit-related properties
interface TreeselectInstanceExtended {
  selectedNodes: TreeselectNode[]
  limit: number
  limitText: (count: number) => string
  getNode: (nodeId: string | number) => TreeselectNode | null
  searchable: boolean
  [key: string]: any
}

// Inject the treeselect instance
const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)

if (!instanceRef) {
  throw new Error('MultiValue must be used within a Treeselect component')
}

// Unwrap computed ref and cast to extended type
const instance = computed<TreeselectInstanceExtended>(() => instanceRef.value as unknown as TreeselectInstanceExtended)

// Get limit (default to Infinity if not available)
const limit = computed(() => {
  return typeof instance.value.limit === 'number' ? instance.value.limit : Infinity
})

// Get limit text function (default if not available)
const limitText = computed(() => {
  return typeof instance.value.limitText === 'function'
    ? instance.value.limitText
    : ((count: number) => `and ${count} more`)
})

// Get visible nodes (up to limit)
const visibleNodes = computed(() => {
  const nodes = instance.value.selectedNodes
  if (limit.value === Infinity) {
    return nodes
  }
  return nodes.slice(0, limit.value)
})

// Check if there are more items beyond the limit
const hasMore = computed(() => {
  return limit.value !== Infinity && instance.value.selectedNodes.length > limit.value
})

// Count of hidden items
const hiddenCount = computed(() => {
  return instance.value.selectedNodes.length - limit.value
})

// Input element reference for parent focusInput() access
const inputRef = ref<HTMLInputElement | null>(null)

// Expose inputRef to parent
defineExpose({
  inputRef
})
</script>

<template>
  <transition-group
    name="vue-treeselect__multi-value-item--transition"
    tag="div"
    class="vue-treeselect__multi-value"
    appear
  >
    <MultiValueItem
      v-for="node in visibleNodes"
      :key="`multi-value-item-${node.id}`"
      :node="node"
    />

    <div
      v-if="hasMore"
      key="exceed-limit-tip"
      class="vue-treeselect__limit-tip vue-treeselect-helper-zoom-effect-off"
    >
      <span class="vue-treeselect__limit-tip-text">
        {{ limitText(hiddenCount) }}
      </span>
    </div>

    <Placeholder
      v-if="!instance.hasValue"
      key="placeholder"
    />

    <Input
      v-if="instance.searchable"
      ref="inputRef"
      key="input"
    />
  </transition-group>
</template>
