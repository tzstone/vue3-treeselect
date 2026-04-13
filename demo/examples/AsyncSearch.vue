<script setup lang="ts">
import { ref } from "vue";
import Treeselect from "vue3-treeselect";

const value = ref<string | null>(null);
const allOptions = ref<any[]>([]);

function loadOptions({ action, searchQuery, callback }: any) {
  if (action === "ASYNC_SEARCH") {
    setTimeout(() => {
      const results = [
        { id: "result-1", label: `Search Result 1 for "${searchQuery}"` },
        { id: "result-2", label: `Search Result 2 for "${searchQuery}"` },
        { id: "result-3", label: `Search Result 3 for "${searchQuery}"` },
      ];
      callback(null, results);
    }, 500);
  }
}
</script>

<template>
  <div class="example">
    <h2 class="example-title">Async Search</h2>
    <p class="example-description">
      Demonstrates asynchronous search with the <code>:async</code> prop. When
      you type in the search box, it simulates an API call with a 500ms delay
      and returns results. This is useful for server-side search with large
      datasets.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :async="true"
        :load-options="loadOptions"
        :options="allOptions"
        placeholder="Type to search..."
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
  font-family: "Courier New", monospace;
  font-size: 13px;
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
