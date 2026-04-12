<script setup lang="ts">
import { onMounted, onBeforeUnmount, provide, computed, ref, type ComputedRef } from 'vue'

import type { TreeselectProps, TreeselectEmits, TreeselectInstance } from '../types'
import { TRESELECT_INSTANCE_KEY } from '../types'
import { useTreeselect } from '../composables/useTreeselect'
import Control from './Control.vue'
import HiddenFields from './HiddenFields.vue'
import Menu from './Menu.vue'
import MenuPortal from './MenuPortal.vue'

// Import SCSS styles
// @ts-ignore - SCSS import
import '../styles/index.scss'

// Template refs
// @ts-ignore - Will be used when child components are uncommented
const wrapperRef = ref<HTMLElement | null>(null)
const controlRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
// @ts-ignore - Will be used for Teleport component
const portalRef = ref<HTMLElement | null>(null)

// Define props
const props = withDefaults(defineProps<TreeselectProps>(), {
  allowClearingDisabled: false,
  allowSelectingDisabledDescendants: false,
  alwaysOpen: false,
  appendToBody: false,
  async: false,
  autoFocus: false,
  autoLoadRootOptions: true,
  autoDeselectAncestors: false,
  autoDeselectDescendants: false,
  autoSelectAncestors: false,
  autoSelectDescendants: false,
  backspaceRemoves: true,
  beforeClearAll: undefined,
  branchNodesFirst: false,
  cacheOptions: true,
  clearable: true,
  clearAllText: 'Clear all',
  clearOnSelect: true,
  clearValueText: 'Clear value',
  closeOnSelect: true,
  defaultExpandLevel: 0,
  defaultOptions: false,
  deleteRemoves: true,
  delimiter: ',',
  flattenSearchResults: false,
  disableBranchNodes: false,
  disabled: false,
  disableFuzzyMatching: false,
  flat: false,
  instanceId: undefined,
  joinValues: false,
  limit: Infinity,
  limitText: (count: number) => `and ${count} more`,
  loadingText: 'Loading...',
  loadOptions: undefined,
  matchKeys: undefined,
  maxHeight: 300,
  multiple: false,
  name: undefined,
  noChildrenText: 'No sub-options.',
  noOptionsText: 'No options available.',
  noResultsText: 'No results found.',
  normalizer: undefined,
  openDirection: 'auto',
  openOnClick: true,
  openOnFocus: false,
  options: undefined,
  placeholder: 'Select...',
  required: false,
  retryText: 'Retry?',
  retryTitle: 'Click to retry',
  searchable: true,
  searchNested: false,
  searchPromptText: 'Type to search...',
  showCount: false,
  showCountOf: 'ALL_CHILDREN',
  showCountOnSearch: null,
  sortValueBy: 'ORDER_SELECTED',
  tabIndex: 0,
  value: undefined,
  valueConsistsOf: 'BRANCH_PRIORITY',
  valueFormat: 'id',
  zIndex: 999,
})

// Define emits
const emit = defineEmits<TreeselectEmits>() as (event: string, ...args: unknown[]) => void

// Initialize composable
const {
  trigger,
  menu,
  forest: _forest,
  rootOptionsStates: _rootOptionsStates,
  localSearch: _localSearch,
  remoteSearch: _remoteSearch,
  internalValue: _internalValue,
  selectedNodes,
  hasValue,
  single,
  hasVisibleOptions: _hasVisibleOptions,
  showCountOnSearchComputed: _showCountOnSearchComputed,
  hasBranchNodes,
  shouldFlattenOptions: _shouldFlattenOptions,
  hasNoOptions: _hasNoOptions,
  hasNoSearchResults: _hasNoSearchResults,
  wrapperClass,
  getInstanceId: _getInstanceId,
  getValue: _getValue,
  getNode,
  isSelected,
  getSelectedNodes,
  initialize: _initialize,
  buildForestState: _buildForestState,
  shouldExpand: _shouldExpand,
  shouldOptionBeIncludedInSearchResult: _shouldOptionBeIncludedInSearchResult,
  shouldShowOptionInMenu: _shouldShowOptionInMenu,
  traverseAllNodesByIndex: _traverseAllNodesByIndex,
  extractCheckedNodeIdsFromValue: _extractCheckedNodeIdsFromValue,
  fixSelectedNodeIds: _fixSelectedNodeIds,
  enhancedNormalizer: _enhancedNormalizer,
  select,
  clear,
  removeLastValue: _removeLastValue,
  openMenu,
  closeMenu,
  toggleMenu,
  toggleExpanded,
  focusInput,
  blurInput,
  setCurrentHighlightedOption: _setCurrentHighlightedOption,
  resetHighlightedOptionWhenNecessary: _resetHighlightedOptionWhenNecessary,
  highlightFirstOption: _highlightFirstOption,
  highlightPrevOption: _highlightPrevOption,
  highlightNextOption: _highlightNextOption,
  highlightLastOption: _highlightLastOption,
  visibleOptionIds: _visibleOptionIds,
  setMenuGetter,
  setControlGetter,
  setInputGetter,
  handleLocalSearch: _handleLocalSearch,
  handleRemoteSearch: _handleRemoteSearch,
  resetSearchQuery: _resetSearchQuery,
  loadRootOptions: _loadRootOptions,
  loadChildrenOptions,
  callLoadOptionsProp: _callLoadOptionsProp,
  handleMouseDown,
  setup,
  onMount: composableOnMount,
  onUnmount: composableOnUnmount,
} = useTreeselect(props, emit)

// Create instance object for provide/inject
const instance = computed(() => ({
  menuIsOpen: menu.isOpen,
  currentHighlightedOptionId: menu.current,
  selectedNodes: selectedNodes.value,
  hasValue: hasValue.value,
  single: single.value,
  multiple: props.multiple,
  hasBranchNodes: hasBranchNodes.value,
  localSearch: _localSearch,
  showCount: props.showCount ?? false,
  showCountOf: props.showCountOf ?? 'ALL_CHILDREN',
  showCountOnSearchComputed: _showCountOnSearchComputed.value ?? false,
  noChildrenText: props.noChildrenText ?? 'No sub-options.',
  loadingText: props.loadingText ?? 'Loading...',
  retryTitle: props.retryTitle ?? 'Click to retry',
  retryText: props.retryText ?? 'Retry?',
  shouldFlattenOptions: _shouldFlattenOptions.value,
  shouldExpand: _shouldExpand,
  shouldShowOptionInMenu: _shouldShowOptionInMenu,
  setCurrentHighlightedOption: _setCurrentHighlightedOption,
  removeLastValue: _removeLastValue,
  disabled: props.disabled ?? false,
  searchable: props.searchable ?? false,
  placeholder: props.placeholder ?? 'Select...',
  clearable: props.clearable ?? true,
  allowClearingDisabled: props.allowClearingDisabled ?? false,
  clearAllText: props.clearAllText ?? 'Clear all',
  clearValueText: props.clearValueText ?? 'Clear value',
  alwaysOpen: props.alwaysOpen ?? false,
  openOnFocus: props.openOnFocus ?? false,
  autoFocus: props.autoFocus ?? false,
  tabIndex: props.tabIndex ?? 0,
  backspaceRemoves: props.backspaceRemoves ?? true,
  deleteRemoves: props.deleteRemoves ?? true,
  limit: props.limit ?? Infinity,
  limitText: props.limitText ?? ((count: number) => `and ${count} more`),
  valueFormat: props.valueFormat ?? 'id',
  delimiter: props.delimiter ?? ',',
  trigger: trigger,
  // Additional properties for Menu component
  maxHeight: props.maxHeight ?? 300,
  zIndex: props.zIndex ?? 999,
  appendToBody: props.appendToBody ?? false,
  async: props.async ?? false,
  rootOptionsStates: _rootOptionsStates,
  forest: _forest,
  remoteSearch: _remoteSearch,
  noOptionsText: props.noOptionsText ?? 'No options available.',
  noResultsText: props.noResultsText ?? 'No results found.',
  searchPromptText: props.searchPromptText ?? 'Type to search...',
  getRemoteSearchEntry: () => {
    const searchQuery = trigger.searchQuery
    return _remoteSearch[searchQuery] || {
      isLoaded: false,
      isLoading: false,
      loadingError: '',
      options: [],
    }
  },
  loadRootOptions: _loadRootOptions,
  handleRemoteSearch: _handleRemoteSearch,
  handleMouseDown,
  openDirection: props.openDirection ?? 'auto',
  getMenu: () => (menuRef.value as any)?.rootElement || null,
  getControl: () => (controlRef.value as any)?.rootElement || null,
  // Expose menu state for template
  menu,
  // Methods
  openMenu,
  closeMenu,
  clear,
  focusInput,
  blurInput,
  getSelectedNodes,
  getNode,
  isSelected,
  toggleExpanded,
  toggleMenu,
  select,
  loadChildrenOptions,
})) as ComputedRef<TreeselectInstance>

// Provide instance to child components (pass computed ref for reactivity)
provide(TRESELECT_INSTANCE_KEY, instance)

// Define exposed methods for template ref access
defineExpose({
  openMenu,
  closeMenu,
  clear,
  focusInput,
  blurInput,
  getSelectedNodes,
  getNode,
  isSelected,
  toggleExpanded,
  toggleMenu,
  select,
  loadChildrenOptions,
})

// Lifecycle hooks
setup()

// Set up ref getters for composable access (must be BEFORE calling composable functions)
setControlGetter(() => (controlRef.value as any)?.rootElement || null)
setMenuGetter(() => (menuRef.value as any)?.rootElement || null)
setInputGetter(() => {
  // Find input element inside control
  const control = (controlRef.value as any)?.rootElement
  if (!control) return null
  return control.querySelector('input') as HTMLInputElement | null
})

// Call this AFTER ref getters are set
onMounted(composableOnMount)
onBeforeUnmount(composableOnUnmount)
</script>

<template>
  <div
    ref="wrapperRef"
    :class="wrapperClass"
    @mousedown="handleMouseDown"
  >
    <HiddenFields v-if="props.name" />
    <Control ref="controlRef" />

    <!-- Menu rendered inline or via Teleport to body -->
    <Teleport v-if="props.appendToBody" to="body">
      <MenuPortal v-if="menu.isOpen" ref="portalRef" />
    </Teleport>
    <Menu v-else-if="menu.isOpen" ref="menuRef" />
  </div>
</template>
