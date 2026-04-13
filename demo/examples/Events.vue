<script setup lang="ts">
import { ref } from "vue";
import Treeselect from "vue3-treeselect";
import { simpleOptions } from "../data";

const value = ref<string | null>(null);
const eventLog = ref<string[]>([]);

function addEvent(message: string) {
  eventLog.value.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
  if (eventLog.value.length > 10) {
    eventLog.value.pop();
  }
}

function handleInput(val: any) {
  addEvent(`input: value changed to ${JSON.stringify(val)}`);
}

function handleSelect(node: any) {
  addEvent(`select: "${node.label}" was selected`);
}

function handleDeselect(node: any) {
  addEvent(`deselect: "${node.label}" was deselected`);
}

function handleOpen() {
  addEvent("open: menu opened");
}

function handleClose() {
  addEvent("close: menu closed");
}

function handleSearch(searchQuery: string) {
  addEvent(`search-change: query is "${searchQuery}"`);
}
</script>

<template>
  <div class="example">
    <h2 class="example-title">Events</h2>
    <p class="example-description">
      Demonstrates all available events: <code>input</code>,
      <code>select</code>, <code>deselect</code>, <code>open</code>,
      <code>close</code>, and <code>search-change</code>. Try interacting with
      the select to see events logged in real-time.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="simpleOptions"
        :searchable="true"
        placeholder="Select an option..."
        @input="handleInput"
        @select="handleSelect"
        @deselect="handleDeselect"
        @open="handleOpen"
        @close="handleClose"
        @search-change="handleSearch"
      />
    </div>
    <div class="event-log">
      <h3 class="log-title">Event Log (latest 10)</h3>
      <div v-if="eventLog.length === 0" class="log-empty">
        No events yet. Start interacting!
      </div>
      <ul v-else class="log-list">
        <li v-for="(event, index) in eventLog" :key="index" class="log-item">
          {{ event }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.example {
  max-width: 700px;
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
  font-family: "Courier New", monospace;
  font-size: 13px;
}

.example-content {
  margin-bottom: 20px;
}

.event-log {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.log-title {
  margin: 0;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.log-empty {
  padding: 24px 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
}

.log-item {
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-family: "Courier New", monospace;
  font-size: 12px;
  color: #555;
}

.log-item:last-child {
  border-bottom: none;
}

.log-item:nth-child(even) {
  background: #fafafa;
}
</style>
