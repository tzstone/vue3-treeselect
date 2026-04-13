<script setup lang="ts">
import { ref } from "vue";
import Treeselect from "vue3-treeselect";
import { nestedOptions } from "../data";

const value = ref<string | null>(null);
</script>

<template>
  <div class="example">
    <h2 class="example-title">Nested Options</h2>
    <p class="example-description">
      This example demonstrates deeply nested options. The tree supports
      unlimited nesting levels. Click the arrow icons to expand/collapse
      branches.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="nestedOptions"
        placeholder="Select an option..."
      />
    </div>
    <div class="example-value">
      <strong>Selected value:</strong> {{ value || "none" }}
    </div>
  </div>
</template>

<style scoped>
.example {
  max-width: 600px;
}

.example-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.example-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.example-content {
  margin-bottom: 20px;
}

.example-value {
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
}
</style>
