<script setup lang="ts">
/**
 * Menu Component
 *
 * Dropdown menu container that displays the option list.
 * Handles menu open/close transitions, scroll management, and tip display.
 */

import { computed, inject, onMounted, onBeforeUnmount, ref, watch, nextTick, type ComputedRef } from 'vue'

import { MENU_BUFFER } from '../constants'
import { watchSize, setupResizeAndScrollEventListeners } from '../utils'
import { TRESELECT_INSTANCE_KEY, type TreeselectInstance } from '../types'
import Option from './Option.vue'
import Tip from './Tip.vue'

// Inject treeselect instance
const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)

if (!instanceRef) {
  throw new Error('Menu component must be used within a Treeselect component')
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

// Template refs
const menuRef = ref<HTMLElement | null>(null)
const rootElement = ref<HTMLElement | null>(null)

// Expose root element for parent access
defineExpose({
  rootElement,
  menuRef,
})

// Direction map for openDirection
const directionMap: Record<string, string> = {
  top: 'top',
  bottom: 'bottom',
  above: 'top',
  below: 'bottom',
}

// Event handlers cleanup
let menuSizeWatcher: { remove: () => void } | null = null
let menuResizeAndScrollEventListeners: { remove: () => void } | null = null

// Computed: Menu style
const menuStyle = computed(() => ({
  maxHeight: `${instance.value!.maxHeight}px`,
}))

// Computed: Menu container style
const menuContainerStyle = computed(() => ({
  zIndex: instance.value!.appendToBody ? undefined : instance.value!.zIndex,
}))

// Computed: Remote search entry
const remoteSearchEntry = computed(() => instance.value!.getRemoteSearchEntry())

// Computed: Should show search prompt tip
const shouldShowSearchPromptTip = computed(
  () => instance.value!.trigger.searchQuery === '' && !(instance.value as any).defaultOptions
)

// Computed: Should show no results tip (async search)
const shouldShowAsyncSearchNoResultsTip = computed(
  () => !shouldShowSearchPromptTip.value && remoteSearchEntry.value.isLoaded && remoteSearchEntry.value.options.length === 0
)

// Computed: Should show no results tip (local search)
const shouldShowLocalSearchNoResultsTip = computed(
  () => instance.value!.localSearch.active && instance.value!.localSearch.noResults
)

// Computed: Has no options
const hasNoOptions = computed(
  () => instance.value!.rootOptionsStates.isLoaded && instance.value!.forest.normalizedOptions.length === 0
)

// Computed: before-list / after-list slot functional components
const beforeListSlot = computed(() => {
  const fn = instance.value.slots?.['before-list']
  return fn ? fn : null
})

const afterListSlot = computed(() => {
  const fn = instance.value.slots?.['after-list']
  return fn ? fn : null
})

// Methods
function onMenuOpen() {
  adjustMenuOpenDirection()
  setupMenuSizeWatcher()
  setupMenuResizeAndScrollEventListeners()
}

function onMenuClose() {
  removeMenuSizeWatcher()
  removeMenuResizeAndScrollEventListeners()
}

function adjustMenuOpenDirection() {
  if (!instance.value!.menuIsOpen) return

  const $menu = menuRef.value
  const $control = instance.value!.getControl()

  if (!$menu || !$control) return

  const menuRect = $menu.getBoundingClientRect()
  const controlRect = $control.getBoundingClientRect()
  const menuHeight = menuRect.height
  const viewportHeight = window.innerHeight
  const spaceAbove = controlRect.top
  const spaceBelow = window.innerHeight - controlRect.bottom
  const isControlInViewport = (
    (controlRect.top >= 0 && controlRect.top <= viewportHeight) ||
    (controlRect.top < 0 && controlRect.bottom > 0)
  )
  const hasEnoughSpaceBelow = spaceBelow > menuHeight + MENU_BUFFER
  const hasEnoughSpaceAbove = spaceAbove > menuHeight + MENU_BUFFER

  if (!isControlInViewport) {
    instance.value!.closeMenu()
  } else if (instance.value!.openDirection !== 'auto') {
    instance.value!.menu.placement = directionMap[instance.value!.openDirection] || 'bottom'
  } else if (hasEnoughSpaceBelow || !hasEnoughSpaceAbove) {
    instance.value!.menu.placement = 'bottom'
  } else {
    instance.value!.menu.placement = 'top'
  }
}

function setupMenuSizeWatcher() {
  const $menu = menuRef.value
  if (!$menu || menuSizeWatcher) return

  menuSizeWatcher = {
    remove: watchSize($menu, adjustMenuOpenDirection),
  }
}

function setupMenuResizeAndScrollEventListeners() {
  const $control = instance.value!.getControl()
  if (!$control || menuResizeAndScrollEventListeners) return

  menuResizeAndScrollEventListeners = {
    remove: setupResizeAndScrollEventListeners($control, adjustMenuOpenDirection),
  }
}

function removeMenuSizeWatcher() {
  if (!menuSizeWatcher) return

  menuSizeWatcher.remove()
  menuSizeWatcher = null
}

function removeMenuResizeAndScrollEventListeners() {
  if (!menuResizeAndScrollEventListeners) return

  menuResizeAndScrollEventListeners.remove()
  menuResizeAndScrollEventListeners = null
}

// Watchers
watch(
  () => instance.value.menuIsOpen,
  (newValue) => {
    if (newValue) {
      nextTick(onMenuOpen)
    } else {
      onMenuClose()
    }
  },
)

// Lifecycle
onMounted(() => {
  if (instance.value.menuIsOpen) {
    nextTick(onMenuOpen)
  }
})

onBeforeUnmount(() => {
  onMenuClose()
})
</script>

<template>
  <div ref="rootElement" class="vue-treeselect__menu-container" :style="menuContainerStyle">
    <transition name="vue-treeselect__menu--transition">
      <div
        v-if="instance!.menuIsOpen"
        ref="menuRef"
        class="vue-treeselect__menu"
        :style="menuStyle"
        @mousedown="instance!.handleMouseDown"
      >
        <!-- Before-list slot -->
        <component :is="beforeListSlot" v-if="beforeListSlot" />

        <!-- Menu content based on mode -->
        <!-- Async search mode -->
        <template v-if="instance!.async">
          <!-- Search prompt tip -->
          <Tip v-if="shouldShowSearchPromptTip" type="search-prompt" icon="warning">
            {{ instance!.searchPromptText }}
          </Tip>

          <!-- Loading tip -->
          <Tip v-else-if="remoteSearchEntry.isLoading" type="loading" icon="loader">
            {{ instance!.loadingText }}
          </Tip>

          <!-- Async search loading error tip -->
          <Tip v-else-if="remoteSearchEntry.loadingError" type="error" icon="error">
            {{ remoteSearchEntry.loadingError }}
            <a
              class="vue-treeselect__retry"
              @click="instance!.handleRemoteSearch"
              :title="instance!.retryTitle"
            >
              {{ instance!.retryText }}
            </a>
          </Tip>

          <!-- No results tip -->
          <Tip v-else-if="shouldShowAsyncSearchNoResultsTip" type="no-results" icon="warning">
            {{ instance!.noResultsText }}
          </Tip>

          <!-- Option list -->
          <div v-else class="vue-treeselect__list">
            <Option
              v-for="rootNode in instance!.forest.normalizedOptions"
              :key="rootNode.id"
              :node="rootNode"
            />
          </div>
        </template>

        <!-- Local search mode -->
        <template v-else-if="instance!.localSearch.active">
          <!-- Loading tip -->
          <Tip v-if="instance!.rootOptionsStates.isLoading" type="loading" icon="loader">
            {{ instance!.loadingText }}
          </Tip>

          <!-- Loading root options error tip -->
          <Tip v-else-if="instance!.rootOptionsStates.loadingError" type="error" icon="error">
            {{ instance!.rootOptionsStates.loadingError }}
            <a
              class="vue-treeselect__retry"
              @click="instance!.loadRootOptions"
              :title="instance!.retryTitle"
            >
              {{ instance!.retryText }}
            </a>
          </Tip>

          <!-- No options tip -->
          <Tip v-else-if="hasNoOptions" type="no-options" icon="warning">
            {{ instance!.noOptionsText }}
          </Tip>

          <!-- No results tip -->
          <Tip v-else-if="shouldShowLocalSearchNoResultsTip" type="no-results" icon="warning">
            {{ instance!.noResultsText }}
          </Tip>

          <!-- Option list -->
          <div v-else class="vue-treeselect__list">
            <Option
              v-for="rootNode in instance!.forest.normalizedOptions"
              :key="rootNode.id"
              :node="rootNode"
            />
          </div>
        </template>

        <!-- Normal mode -->
        <template v-else>
          <!-- Loading tip -->
          <Tip v-if="instance!.rootOptionsStates.isLoading" type="loading" icon="loader">
            {{ instance!.loadingText }}
          </Tip>

          <!-- Loading root options error tip -->
          <Tip v-else-if="instance!.rootOptionsStates.loadingError" type="error" icon="error">
            {{ instance!.rootOptionsStates.loadingError }}
            <a
              class="vue-treeselect__retry"
              @click="instance!.loadRootOptions"
              :title="instance!.retryTitle"
            >
              {{ instance!.retryText }}
            </a>
          </Tip>

          <!-- No options tip -->
          <Tip v-else-if="hasNoOptions" type="no-options" icon="warning">
            {{ instance!.noOptionsText }}
          </Tip>

          <!-- Option list -->
          <div v-else class="vue-treeselect__list">
            <Option
              v-for="rootNode in instance!.forest.normalizedOptions"
              :key="rootNode.id"
              :node="rootNode"
            />
          </div>
        </template>

        <!-- After-list slot -->
        <component :is="afterListSlot" v-if="afterListSlot" />
      </div>
    </transition>
  </div>
</template>
