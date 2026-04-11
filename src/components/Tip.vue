<script setup lang="ts">
/**
 * Tip Component
 *
 * Displays a tip/message in the menu (e.g., "Loading...", "No children", "Error").
 * Used by Option and Menu components to show status messages.
 */

interface TipProps {
  /** Type of tip */
  type: 'no-children' | 'loading' | 'error' | 'search-prompt' | 'no-options' | 'no-results'
  /** Icon type */
  icon: 'warning' | 'loader' | 'error'
}

defineProps<TipProps>()
</script>

<template>
  <div :class="['vue-treeselect__tip', `vue-treeselect__${type}-tip`]">
    <div class="vue-treeselect__icon-container">
      <span :class="`vue-treeselect__icon-${icon}`" />
    </div>
    <span :class="['vue-treeselect__tip-text', `vue-treeselect__${type}-tip-text`]">
      <slot />
    </span>
  </div>
</template>
