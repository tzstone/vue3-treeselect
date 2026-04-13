<template>
  <div :class="placeholderClass">
    {{ instance.trigger.searchQuery || instance.placeholder }}
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type ComputedRef } from "vue";
import { TRESELECT_INSTANCE_KEY, type TreeselectInstance } from "../types";

const instanceRef = inject<ComputedRef<TreeselectInstance>>(
  TRESELECT_INSTANCE_KEY,
);

if (!instanceRef) {
  throw new Error("Placeholder must be used within a Treeselect component");
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value);

const placeholderClass = computed(() => ({
  "vue-treeselect__placeholder": true,
  "vue-treeselect-helper-zoom-effect-off": true,
  "vue-treeselect-helper-hide":
    instance.value.hasValue || instance.value.trigger.searchQuery,
}));
</script>
