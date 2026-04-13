<script setup lang="ts">
import { ref } from 'vue'
import Treeselect from 'vue3-treeselect'
import { simpleOptions } from '../data'

const value = ref<string | null>(null)
const treeselectRef = ref<InstanceType<typeof Treeselect> | null>(null)

function openMenu() {
  treeselectRef.value?.openMenu()
}

function closeMenu() {
  treeselectRef.value?.closeMenu()
}

function clear() {
  treeselectRef.value?.clear()
}

function focusInput() {
  treeselectRef.value?.focusInput()
}

function blurInput() {
  treeselectRef.value?.blurInput()
}
</script>

<template>
  <div class="example">
    <h2 class="example-title">Programmatic Methods</h2>
    <p class="example-description">
      Demonstrates all public methods for programmatic control of the component.
      Use the buttons below to trigger methods like opening/closing the menu,
      clearing selection, and managing input focus. This is useful for custom
      UI patterns and integration with other components.
    </p>
    <div class="method-buttons">
      <button @click="openMenu" class="method-btn">Open Menu</button>
      <button @click="closeMenu" class="method-btn">Close Menu</button>
      <button @click="clear" class="method-btn">Clear Selection</button>
      <button @click="focusInput" class="method-btn">Focus Input</button>
      <button @click="blurInput" class="method-btn">Blur Input</button>
    </div>
    <div class="example-content">
      <Treeselect
        ref="treeselectRef"
        v-model="value"
        :options="simpleOptions"
        placeholder="Select an option..."
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
  margin: 0 b 24px 0;
  line-height: 1.6;
}

.method-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.method-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.method-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.method-btn:active {
  transform: translateY(0);
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
