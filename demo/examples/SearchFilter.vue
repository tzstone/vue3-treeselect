<script setup lang="ts">
import { ref } from 'vue'
import { Treeselect } from 'vue3-treeselect'

const value = ref<string | null>(null)

const options = [
  {
    id: 'fruits',
    label: 'Fruits',
    children: [
      { id: 'apple', label: 'Apple' },
      { id: 'apricot', label: 'Apricot' },
      { id: 'avocado', label: 'Avocado' },
      { id: 'banana', label: 'Banana' },
      { id: 'blueberry', label: 'Blueberry' },
      { id: 'cherry', label: 'Cherry' },
      { id: 'coconut', label: 'Coconut' },
      { id: 'date', label: 'Date' },
    ],
  },
  {
    id: 'vegetables',
    label: 'Vegetables',
    children: [
      { id: 'artichoke', label: 'Artichoke' },
      { id: 'asparagus', label: 'Asparagus' },
      { id: 'broccoli', label: 'Broccoli' },
      { id: 'cabbage', label: 'Cabbage' },
      { id: 'carrot', label: 'Carrot' },
      { id: 'cauliflower', label: 'Cauliflower' },
      { id: 'cucumber', label: 'Cucumber' },
      { id: 'eggplant', label: 'Eggplant' },
    ],
  },
]
</script>

<template>
  <div class="example">
    <h2 class="example-title">Search Filter</h2>
    <p class="example-description">
      Demonstrates local fuzzy search functionality. Type in the search box to filter
      the available options. The search is performed locally on the client side using
      fuzzy matching. Try searching for "ap" to see Apple, Apricot, and Asparagus.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="options"
        :searchable="true"
        placeholder="Type to search options..."
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
