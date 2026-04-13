<script setup lang="ts">
import { computed, inject, type ComputedRef } from "vue";

import type { TreeselectInstance } from "../types";
import { TRESELECT_INSTANCE_KEY } from "../types";

// Import SCSS styles
// @ts-ignore - SCSS import
import "../styles/index.scss";

// Inject the treeselect instance
const instanceRef = inject<ComputedRef<TreeselectInstance>>(
  TRESELECT_INSTANCE_KEY,
);

if (!instanceRef) {
  throw new Error("SingleValue must be used within a Treeselect component");
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value);

// Computed: Whether to show the value
const shouldShowValue = computed(() => {
  return instance.value.hasValue && !instance.value.trigger.searchQuery;
});

// Computed: Selected node (first for single-select mode)
const selectedNode = computed(() => {
  return instance.value.selectedNodes[0];
});
</script>

<template>
  <div v-if="shouldShowValue" class="vue-treeselect__single-value">
    <template v-if="instance.slots?.['value-label']">
      <component
        :is="() => instance.slots!['value-label']!({ node: selectedNode })"
      />
    </template>
    <template v-else>
      {{ selectedNode?.label }}
    </template>
  </div>
</template>
