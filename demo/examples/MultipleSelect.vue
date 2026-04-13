<script setup lang="ts">
import { ref } from "vue";
import Treeselect from "vue3-treeselect";
import { simpleOptions } from "../data";

const value = ref<string[]>([]);
</script>

<template>
  <div class="example">
    <h2 class="example-title">Multiple Select</h2>
    <p class="example-description">
      Set the <code>multiple</code> prop to <code>true</code> to enable multiple
      selection. Users can select multiple options from the tree.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="simpleOptions"
        :multiple="true"
        placeholder="Select multiple options..."
      />
    </div>
    <div class="example-value">
      <strong>Selected values:</strong>
      {{ value.length > 0 ? value.join(", ") : "none" }}
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
