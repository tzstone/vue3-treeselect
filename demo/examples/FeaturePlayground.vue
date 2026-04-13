<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import Treeselect from "vue3-treeselect";
import { simpleOptions } from "../data";

const features = reactive({
  multiple: false,
  flat: false,
  searchable: true,
  async: false,
  clearable: true,
  disableBranchNodes: false,
  showCount: false,
  searchNested: false,
});

const value = ref<string | string[] | null>(null);
const options = ref(simpleOptions);

function loadOptions({ action, searchQuery, callback }: any) {
  if (action === "ASYNC_SEARCH") {
    setTimeout(() => {
      const filtered = simpleOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (opt.children &&
            opt.children.some((child: any) =>
              child.label.toLowerCase().includes(searchQuery.toLowerCase()),
            )),
      );
      callback(null, filtered);
    }, 500);
  }
}

const treeselectProps = computed(() => ({
  multiple: features.multiple,
  flat: features.flat,
  searchable: features.searchable,
  async: features.async,
  clearable: features.clearable,
  disableBranchNodes: features.disableBranchNodes,
  showCount: features.showCount,
  searchNested: features.searchNested,
}));

const activeFeaturesList = computed(() => {
  return (
    Object.entries(features)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(", ") || "none"
  );
});
</script>

<template>
  <div class="example">
    <h2 class="example-title">Feature Playground</h2>
    <p class="example-description">
      Interactive demo with checkbox controls for all major features. Toggle
      features to see how they affect the treeselect component in real-time.
    </p>

    <div class="checkbox-group">
      <label class="checkbox-item">
        <input v-model="features.multiple" type="checkbox" />
        <span>Multiple</span>
      </label>
      <label class="checkbox-item">
        <input v-model="features.flat" type="checkbox" />
        <span>Flat Mode</span>
      </label>
      <label class="checkbox-item">
        <input v-model="features.searchable" type="checkbox" />
        <span>Searchable</span>
      </label>
      <label class="checkbox-item">
        <input v-model="features.async" type="checkbox" />
        <span>Async Search</span>
      </label>
      <label class="checkbox-item">
        <input v-model="features.clearable" type="checkbox" />
        <span>Clearable</span>
      </label>
      <label class="checkbox-item">
        <input v-model="features.disableBranchNodes" type="checkbox" />
        <span>Disable Branch Nodes</span>
      </label>
      <label class="checkbox-item">
        <input v-model="features.showCount" type="checkbox" />
        <span>Show Count</span>
      </label>
      <label class="checkbox-item">
        <input v-model="features.searchNested" type="checkbox" />
        <span>Search Nested</span>
      </label>
    </div>

    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="options"
        v-bind="treeselectProps"
        :load-options="features.async ? loadOptions : undefined"
        :placeholder="
          features.multiple
            ? 'Select multiple options...'
            : 'Select an option...'
        "
      />
    </div>

    <div class="example-value">
      <strong>Selected value:</strong>
      {{
        features.multiple
          ? Array.isArray(value)
            ? value.join(", ")
            : "none"
          : value || "none"
      }}
    </div>

    <div class="example-config">
      <strong>Active Features:</strong> {{ activeFeaturesList }}
    </div>
  </div>
</template>

<style scoped>
.example {
  max-width: 800px;
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

.example-content {
  margin-bottom: 20px;
}

.example-value,
.example-config {
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 6px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  cursor: pointer;
}
</style>
