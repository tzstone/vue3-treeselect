<script setup lang="ts">
import { ref } from 'vue'
import { Treeselect } from 'vue3-treeselect'
import { customLabelOptions } from '../data'

const value = ref<string | null>(null)

// Custom label formatter
function formatLabel(node: { label: string }) {
  return `👤 ${node.label}`
}

// Custom value formatter
function formatValue(value: string, node: { label: string }) {
  return node.label
}
</script>

<template>
  <div class="example">
    <h2 class="example-title">Custom Labels</h2>
    <p class="example-description">
      Use the <code>formatLabel</code> prop to customize how option labels are displayed.
      This is useful for adding prefixes, suffixes, or other formatting.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="customLabelOptions"
        :format-label="formatLabel"
        :format-value="formatValue"
        placeholder="Select a person..."
      />
    </div>
    <div class="example-value">
      <strong>Selected value:</strong> {{ value || 'none' }}
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
  font-family: 'Monaco', 'Courier New', monospace;
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
