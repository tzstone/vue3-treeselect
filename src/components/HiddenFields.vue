<script setup lang="ts">
import { computed, inject, type ComputedRef } from 'vue'
import { isNaN } from '../utils'
import type { TreeselectInstance } from '../types'
import { TRESELECT_INSTANCE_KEY } from '../types'

// Import SCSS styles
// @ts-ignore - SCSS import
import '../styles/index.scss'

// Inject the treeselect instance
const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)

if (!instanceRef) {
  throw new Error('HiddenFields must be used within a Treeselect component')
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

// Helper function to stringify value
function stringifyValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (value != null && !isNaN(value)) return JSON.stringify(value)
  return ''
}

// Computed: Get props from instance
const name = computed(() => (instance.value as any).name)
const disabled = computed(() => (instance.value as any).disabled)
const internalValue = computed(() => (instance.value as any).internalValue || [])
const multiple = computed(() => (instance.value as any).multiple)
const joinValues = computed(() => (instance.value as any).joinValues)
const delimiter = computed(() => (instance.value as any).delimiter || ',')

// Computed: Get stringified values
const stringifiedValues = computed(() => {
  if (!name.value || disabled.value || !instance.value.hasValue) {
    return []
  }

  let values = internalValue.value.map(stringifyValue)

  if (multiple.value && joinValues.value) {
    values = [values.join(delimiter.value)]
  }

  return values
})
</script>

<template>
  <template v-for="(stringifiedValue, i) in stringifiedValues" :key="'hidden-field-' + i">
    <input
      type="hidden"
      :name="name"
      :value="stringifiedValue"
      class="vue-treeselect__hidden-field"
    />
  </template>
</template>
