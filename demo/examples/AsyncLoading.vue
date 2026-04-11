<script setup lang="ts">
import { ref } from 'vue'
import { Treeselect } from 'vue3-treeselect'
import type { TreeselectOption } from '../data'

interface AsyncNode extends TreeselectOption {
  children?: AsyncNode[]
  loadChildren?: boolean
}

const isLoading = ref(false)
const value = ref<string | null>(null)

const asyncRootOptions: AsyncNode[] = [
  {
    id: 'region-1',
    label: 'Region 1',
    isBranch: true,
    children: null,
    loadChildren: true,
  },
  {
    id: 'region-2',
    label: 'Region 2',
    isBranch: true,
    children: null,
    loadChildren: true,
  },
]

async function loadOptions({ action, parentNode, callback }: { action: string; parentNode: any; callback: () => void }) {
  if (action === 'LOAD_CHILDREN_OPTIONS' && parentNode.loadChildren) {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))

    const children = [
      { id: `${parentNode.id}-child-1`, label: `${parentNode.label} - Child 1` },
      { id: `${parentNode.id}-child-2`, label: `${parentNode.label} - Child 2` },
      { id: `${parentNode.id}-child-3`, label: `${parentNode.label} - Child 3` },
    ]

    parentNode.children = children
    parentNode.loadChildren = false
    isLoading.value = false
    callback()
  }
}
</script>

<template>
  <div class="example">
    <h2 class="example-title">Async Loading</h2>
    <p class="example-description">
      Demonstrates lazy loading of child options. Click the arrow to expand a node
      and the children will be loaded asynchronously with a simulated 1-second delay.
    </p>
    <div class="example-content">
      <Treeselect
        v-model="value"
        :options="asyncRootOptions"
        :load-options="loadOptions"
        :loading="isLoading"
        placeholder="Select an option..."
      />
    </div>
    <div class="example-value">
      <strong>Selected value:</strong> {{ value || 'none' }}
      <span v-if="isLoading" class="loading-indicator"> (loading...)</span>
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
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #e83e8c;
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

.loading-indicator {
  color: #999;
  font-style: italic;
}
</style>
