<script setup lang="ts">
import { ref } from 'vue'
import Treeselect from 'vue3-treeselect'
import { simpleOptions } from '../data'

const value = ref<string | null>(null)
</script>

<template>
  <div class="example">
    <h2 class="example-title">Append to Body</h2>
    <p class="example-description">
      Demonstrates the <code>appendToBody</code> prop which renders the dropdown menu
      directly in the document body using Vue's Teleport. This is useful when the select
      is inside a container with <code>overflow: hidden</code> or other CSS clipping.
      Check your browser's developer tools to see the menu rendered at the end of the body.
    </p>
    <div class="example-content">
      <div class="clipped-container">
        <p class="container-hint">This container has overflow: hidden</p>
        <Treeselect
          v-model="value"
          :options="simpleOptions"
          :append-to-body="true"
          placeholder="Select an option..."
        />
      </div>
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

.clipped-container {
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  overflow: hidden;
  max-height: 300px;
  position: relative;
}

.container-hint {
  font-size: 12px;
  color: #999;
  margin: 0 0 16px 0;
  text-align: center;
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
