<script setup lang="ts">
import { ref, shallowRef } from "vue";
import Basic from "./examples/Basic.vue";
import MultipleSelect from "./examples/MultipleSelect.vue";
import NestedOptions from "./examples/NestedOptions.vue";
import DisabledOptions from "./examples/DisabledOptions.vue";
import CustomLabels from "./examples/CustomLabels.vue";
import FlatMode from "./examples/FlatMode.vue";
import ValueFormatters from "./examples/ValueFormatters.vue";
import AsyncLoading from "./examples/AsyncLoading.vue";
import AsyncSearch from "./examples/AsyncSearch.vue";
import DelayedLoading from "./examples/DelayedLoading.vue";
import SearchFilter from "./examples/SearchFilter.vue";
import KeyboardNav from "./examples/KeyboardNav.vue";
import Slots from "./examples/Slots.vue";
import RTL from "./examples/RTL.vue";
import AppendToBody from "./examples/AppendToBody.vue";
import SortValue from "./examples/SortValue.vue";
import Events from "./examples/Events.vue";
import Methods from "./examples/Methods.vue";

interface Example {
  id: string;
  title: string;
  component: any;
}

const examples: Example[] = [
  { id: "basic", title: "Basic", component: Basic },
  { id: "multiple", title: "Multiple Select", component: MultipleSelect },
  { id: "nested", title: "Nested Options", component: NestedOptions },
  { id: "disabled", title: "Disabled Options", component: DisabledOptions },
  { id: "custom-labels", title: "Custom Labels", component: CustomLabels },
  { id: "flat", title: "Flat Mode", component: FlatMode },
  { id: "formatters", title: "Value Formatters", component: ValueFormatters },
  { id: "async-loading", title: "Async Loading", component: AsyncLoading },
  { id: "async-search", title: "Async Search", component: AsyncSearch },
  {
    id: "delayed-loading",
    title: "Delayed Loading",
    component: DelayedLoading,
  },
  { id: "search-filter", title: "Search Filter", component: SearchFilter },
  { id: "keyboard-nav", title: "Keyboard Navigation", component: KeyboardNav },
  { id: "slots", title: "Custom Slots", component: Slots },
  { id: "rtl", title: "RTL Support", component: RTL },
  { id: "append-to-body", title: "Append to Body", component: AppendToBody },
  { id: "sort-value", title: "Sort Value Order", component: SortValue },
  { id: "events", title: "Events", component: Events },
  { id: "methods", title: "Programmatic Methods", component: Methods },
];

const activeExample = ref(examples[0].id);

const currentExample = shallowRef(examples[0].component);

function selectExample(exampleId: string) {
  activeExample.value = exampleId;
  const example = examples.find((e) => e.id === exampleId);
  if (example) {
    currentExample.value = example.component;
  }
}
</script>

<template>
  <div class="demo-container">
    <aside class="sidebar">
      <h1 class="sidebar-title">Vue 3 Treeselect</h1>
      <nav class="sidebar-nav">
        <button
          v-for="example in examples"
          :key="example.id"
          :class="['nav-button', { active: activeExample === example.id }]"
          @click="selectExample(example.id)"
        >
          {{ example.title }}
        </button>
      </nav>
    </aside>
    <main class="main-content">
      <component :is="currentExample" />
    </main>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, sans-serif;
}

.sidebar {
  width: 250px;
  background: #1a1a2e;
  color: #fff;
  padding: 20px;
  border-right: 1px solid #333;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 30px 0;
  color: #fff;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-button {
  background: transparent;
  border: none;
  color: #a0a0a0;
  padding: 10px 15px;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: #2a2a4e;
  color: #fff;
}

.nav-button.active {
  background: #4a4a8e;
  color: #fff;
  font-weight: 500;
}

.main-content {
  flex: 1;
  padding: 40px;
  background: #f5f5f5;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .demo-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #333;
  }

  .main-content {
    padding: 20px;
  }
}
</style>
