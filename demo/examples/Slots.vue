<script setup lang="ts">
import { ref } from 'vue'
import Treeselect from 'vue3-treeselect'
import { simpleOptions } from '../data'

const value = ref<string | null>(null)
</script>

<template>
  <div class="example">
    <h2 class="example-title">Custom Slots</h2>
    <p class="example-description">
      Demonstrates all four scoped slots for customizing the component:
      <code>before-list</code>, <code>after-list</code>, <code>option-label</code>,
      and <code>value-label</code>.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="simpleOptions"
        placeholder="Select an option..."
      >
        <template #before-list>
          <div class="slot-before">🔍 Search or select from the list below</div>
        </template>

        <template #after-list>
          <div class="slot-after">💡 Tip: Use keyboard navigation for faster selection</div>
        </template>

        <template #option-label="{ node }">
          <span class="custom-option-label">
            <span v-if="node.isBranch" class="branch-icon">📁</span>
            <span v-else class="leaf-icon">📄</span>
            {{ node.label }}
          </span>
        </template>

        <template #value-label="{ node }">
          <span class="custom-value-label">
            <span class="selected-icon">✓</span>
            {{ node.label }}
          </span>
        </template>
      </Treeselect>
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
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.example-content {
  margin-bottom: 20px;
}

.slot-before {
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 13px;
  font-weight: 500;
}

.slot-after {
  padding: 10px 16px;
  background: #f8f9fa;
  color: #666;
  font-size: 12px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
}

.custom-option-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.branch-icon,
.leaf-icon {
  font-size: 14px;
}

.custom-value-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.selected-icon {
  color: #4caf50;
  font-weight: bold;
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
