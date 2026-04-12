<script setup lang="ts">
import { ref } from "vue";
import { Treeselect } from "vue3-treeselect";
import { generateOptions } from "../utils";
const value = ref<string | null>(null);
const flatOptions = generateOptions(3);
</script>

<template>
  <div class="example">
    <h2 class="example-title">Flat Mode</h2>
    <p class="example-description">
      Set <code>flat</code> prop to <code>true</code> to display all options at
      the same level, regardless of their position in the tree structure. This
      is useful for flat lists of options.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="flatOptions"
        :multiple="true"
        :flat="true"
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

.example-description code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Monaco", "Courier New", monospace;
  font-size: 13px;
  color: #e83e8c;
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
