<script setup lang="ts">
import { ref } from "vue";
import { Treeselect } from "vue3-treeselect";
import { simpleOptions } from "../data";

const value = ref<string | null>(null);
</script>

<template>
  <div class="example">
    <h2 class="example-title">Keyboard Navigation</h2>
    <p class="example-description">
      Demonstrates keyboard shortcuts for accessibility and power users. Try
      these keyboard commands while the select is focused:
    </p>
    <div class="shortcuts">
      <div class="shortcut-item">
        <kbd>↑</kbd> <kbd>↓</kbd>
        <span>Navigate up/down through options</span>
      </div>
      <div class="shortcut-item">
        <kbd>←</kbd> <kbd>→</kbd>
        <span>Expand/collapse branches</span>
      </div>
      <div class="shortcut-item">
        <kbd>Enter</kbd>
        <span>Select highlighted option</span>
      </div>
      <div class="shortcut-item">
        <kbd>Escape</kbd>
        <span>Close menu</span>
      </div>
      <div class="shortcut-item">
        <kbd>Backspace</kbd>
        <span>Delete last selected (multiple mode)</span>
      </div>
      <div class="shortcut-item">
        <kbd>Delete</kbd>
        <span>Clear all selections</span>
      </div>
    </div>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="simpleOptions"
        :multiple="true"
        placeholder="Focus and try keyboard navigation..."
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
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.shortcuts {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 24px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
}

.shortcut-item:last-child {
  margin-bottom: 0;
}

.shortcut-item kbd {
  display: inline-block;
  padding: 3px 7px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  font-size: 12px;
  margin-right: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.shortcut-item span {
  color: #555;
  margin-left: 8px;
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
