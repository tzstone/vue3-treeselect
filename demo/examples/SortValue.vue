<script setup lang="ts">
import { ref } from 'vue'
import Treeselect from 'vue3-treeselect'

const sortMode = ref('ORDER_SELECTED')
const value = ref<string[]>([])

const options = [
  {
    id: 'vegetables',
    label: 'Vegetables',
    children: [
      { id: 'carrot', label: 'Carrot' },
      { id: 'broccoli', label: 'Broccoli' },
      { id: 'spinach', label: 'Spinach' },
    ],
  },
  {
    id: 'fruits',
    label: 'Fruits',
    children: [
      { id: 'apple', label: 'Apple' },
      { id: 'banana', label: 'Banana' },
      { id: 'cherry', label: 'Cherry' },
    ],
  },
  {
    id: 'grains',
    label: 'Grains',
    children: [
      { id: 'rice', label: 'Rice' },
      { id: 'wheat', label: 'Wheat' },
      { id: 'corn', label: 'Corn' },
    ],
  },
]
</script>

<template>
  <div class="example">
    <h2 class="example-title">Sort Value Order</h2>
    <p class="example-description">
      Demonstrates the <code>sortValueBy</code> prop which controls how selected values
      are ordered in multiple-select mode. Change the sort mode to see different ordering:
    </p>
    <div class="sort-controls">
      <label>
        <input type="radio" v-model="sortMode" value="ORDER_SELECTED" />
        <span>ORDER_SELECTED (selection order)</span>
      </label>
      <label>
        <input type="radio" v-model="sortMode" value="LEVEL" />
        <span>LEVEL (tree depth)</span>
      </label>
      <label>
        <input type="radio" v-model="sortMode" value="INDEX" />
        <span>INDEX (option order)</span>
      </label>
    </div>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="options"
        :multiple="true"
        :sort-value-by="sortMode"
        placeholder="Select multiple options..."
      />
    </div>
    <div class="example-value">
      <strong>Selected value:</strong> {{ value.length ? value.join(', ') : 'none' }}
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
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.example-description code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.sort-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.sort-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.sort-controls input[type="radio"] {
  cursor: pointer;
}

.sort-controls span {
  color: #555;
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
  word-break: break-all;
}
</style>
