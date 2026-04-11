<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Treeselect } from 'vue3-treeselect'

const value = ref<string | null>(null)
const options = ref<any[]>([])
const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    options.value = [
      {
        id: 'category-1',
        label: 'Category 1',
        children: [
          { id: 'item-1-1', label: 'Item 1-1' },
          { id: 'item-1-2', label: 'Item 1-2' },
        ],
      },
      {
        id: 'category-2',
        label: 'Category 2',
        children: [
          { id: 'item-2-1', label: 'Item 2-1' },
          { id: 'item-2-2', label: 'Item 2-2' },
        ],
      },
    ]
    isLoading.value = false
  }, 800)
})
</script>

<template>
  <div class="example">
    <h2 class="example-title">Delayed Loading</h2>
    <p class="example-description">
      Demonstrates lazy initial loading of options. The options are loaded after
      a simulated 800ms delay when the component mounts. The component shows
      a loading state until the data is ready. Useful for initial data fetching.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="options"
        :disabled="isLoading"
        :placeholder="isLoading ? 'Loading options...' : 'Select an option...'"
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
