import {
  reactive,
  computed,
  watch,
  nextTick,
} from 'vue'

import {
  createMap,
  debounce,
  isPromise,
  quickDiff,
  includes,
} from '../utils'

import {
  LOAD_ROOT_OPTIONS, LOAD_CHILDREN_OPTIONS,
  ALL, BRANCH_PRIORITY, LEAF_PRIORITY, ALL_WITH_INDETERMINATE,
  LEVEL, INDEX,
  INPUT_DEBOUNCE_DELAY,
} from '../constants'

import type {
  TreeselectProps,
  TreeselectNode,
  TreeselectOption,
  CountMap,
} from '../types'

import { useForest, type ForestState, type LocalSearchState, type TriggerState, type MenuState } from './useForest'
import { useSearch } from './useSearch'
import { useSelection } from './useSelection'
import { useMenu } from './useMenu'

let instanceIdCounter = 0

export interface AsyncOptionsStates {
  isLoaded: boolean
  isLoading: boolean
  loadingError: string
}

function createAsyncOptionsStates(): AsyncOptionsStates {
  return {
    isLoaded: false,
    isLoading: false,
    loadingError: '',
  }
}

function getErrorMessage(err: Error | string): string {
  return (err instanceof Error ? err.message : String(err)) || ''
}

export function useTreeselect(
  props: TreeselectProps,
  emit: (event: string, ...args: unknown[]) => void,
) {
  const trigger = reactive<TriggerState>({
    isFocused: false,
    searchQuery: '',
  })

  const menu = reactive<MenuState>({
    isOpen: false,
    current: null,
    lastScrollPosition: 0,
    placement: 'bottom',
  })

  const forest = reactive<ForestState>({
    normalizedOptions: [],
    nodeMap: createMap<TreeselectNode>(),
    checkedStateMap: createMap<number>(),
    selectedNodeIds: [],
    selectedNodeMap: createMap<boolean>(),
  })

  const rootOptionsStates = reactive<AsyncOptionsStates>(createAsyncOptionsStates())

  const localSearch = reactive<LocalSearchState>({
    active: false,
    noResults: true,
    countMap: createMap<CountMap>(),
  })

  const remoteSearch = reactive<Record<string, ReturnType<typeof createAsyncOptionsStates> & { options: TreeselectOption[] }>>(
    createMap<ReturnType<typeof createAsyncOptionsStates> & { options: TreeselectOption[] }>()
  )

  const forestComposable = useForest(props, forest, localSearch, emit)

  const searchComposable = useSearch(
    props, forest, localSearch, trigger, remoteSearch,
    forestComposable.getNode,
    forestComposable.traverseAllNodesDFS,
    forestComposable.shouldExpand,
    forestComposable.initialize,
    () => menuComposable.resetHighlightedOptionWhenNecessary(true),
    () => getInstanceId(),
    callLoadOptionsProp,
    emit,
  )

  // Wire up getRemoteSearchEntry to useForest
  forestComposable.setGetRemoteSearchEntry(searchComposable.getRemoteSearchEntry)

  function closeMenu(): void {
    if (!menu.isOpen || (!props.disabled && props.alwaysOpen)) return
    menuComposable.saveMenuScrollPosition()
    menu.isOpen = false
    menuComposable.toggleClickOutsideEvent(false)
    searchComposable.resetSearchQuery()
    emit('close', getValue(), getInstanceId())
  }

  function blurInput(): void {
    menuComposable.blurInput()
  }

  const menuComposable = useMenu(
    props, forest, menu, trigger, localSearch,
    forestComposable.getNode,
    forestComposable.shouldExpand,
    forestComposable.shouldShowOptionInMenu,
    () => getInstanceId(),
    getValue,
    searchComposable.resetSearchQuery,
    loadRootOptions,
    emit,
  )

  const selectionComposable = useSelection(
    props, forest,
    forestComposable.getNode,
    forestComposable.isSelected,
    forestComposable.getSelectedNodes,
    forestComposable.buildForestState,
    forestComposable.traverseDescendantsBFS,
    forestComposable.traverseDescendantsDFS,
    { get value() { return internalValue.value } },
    emit,
    searchComposable.resetSearchQuery,
    closeMenu,
  )

  // Initialize selectedNodeIds from value
  forest.selectedNodeIds = forestComposable.extractCheckedNodeIdsFromValue()

  function getInstanceId(): string | number {
    return props.instanceId ?? `${instanceIdCounter++}$$`
  }

  function getValue(): unknown {
    if (props.valueFormat === 'id') {
      return props.multiple
        ? internalValue.value.slice()
        : internalValue.value[0]
    }

    const rawNodes = internalValue.value.map(id => {
      const node = forestComposable.getNode(id)
      return node ? node.raw : null
    }).filter(Boolean)
    return props.multiple ? rawNodes : rawNodes[0]
  }

  const internalValue = computed(() => {
    let result: (string | number)[]

    if (!props.multiple || props.flat || props.disableBranchNodes || props.valueConsistsOf === ALL) {
      result = forest.selectedNodeIds.slice()
    } else if (props.valueConsistsOf === BRANCH_PRIORITY) {
      result = forest.selectedNodeIds.filter(id => {
        const node = forestComposable.getNode(id)
        if (!node) return false
        if (node.isRootNode) return true
        return node.parentNode != null && !forestComposable.isSelected(node.parentNode)
      })
    } else if (props.valueConsistsOf === LEAF_PRIORITY) {
      result = forest.selectedNodeIds.filter(id => {
        const node = forestComposable.getNode(id)
        if (!node) return false
        if (node.isLeaf) return true
        return node.children.length === 0
      })
    } else if (props.valueConsistsOf === ALL_WITH_INDETERMINATE) {
      const indeterminateNodeIds: (string | number)[] = []
      result = forest.selectedNodeIds.slice()
      forestComposable.getSelectedNodes().forEach(selectedNode => {
        selectedNode.ancestors.forEach(ancestor => {
          if (includes(indeterminateNodeIds, ancestor.id)) return
          if (includes(result, ancestor.id)) return
          indeterminateNodeIds.push(ancestor.id)
        })
      })
      result.push(...indeterminateNodeIds)
    } else {
      result = forest.selectedNodeIds.slice()
    }

    if (props.sortValueBy === LEVEL) {
      result.sort((a, b) => forestComposable.sortValueByLevel(
        forestComposable.getNode(a)!, forestComposable.getNode(b)!
      ))
    } else if (props.sortValueBy === INDEX) {
      result.sort((a, b) => forestComposable.sortValueByIndex(
        forestComposable.getNode(a)!, forestComposable.getNode(b)!
      ))
    }

    return result
  })

  const selectedNodes = computed(() => {
    return forest.selectedNodeIds.map(id => forestComposable.getNode(id)).filter(Boolean) as TreeselectNode[]
  })

  const hasValue = computed(() => internalValue.value.length > 0)

  const single = computed(() => !props.multiple)

  const hasVisibleOptions = computed(() => {
    return menuComposable.hasVisibleOptions.value
  })

  const showCountOnSearchComputed = computed(() => {
    return typeof props.showCountOnSearch === 'boolean'
      ? props.showCountOnSearch
      : props.showCount
  })

  const hasBranchNodes = computed(() => {
    return forest.normalizedOptions.some(rootNode => rootNode.isBranch)
  })

  const shouldFlattenOptions = computed(() => {
    return localSearch.active && !!props.flattenSearchResults
  })

  const hasNoOptions = computed(() => {
    return forest.normalizedOptions.length === 0
  })

  const hasNoSearchResults = computed(() => {
    return localSearch.active && localSearch.noResults
  })

  // =========================================================================
  // Async Loading
  // =========================================================================

  function callLoadOptionsProp(params: {
    action: string
    args?: Record<string, unknown>
    isPending: () => boolean
    start: () => void
    succeed: (result?: unknown) => void
    fail: (err: Error | string) => void
    end: () => void
  }): void {
    if (!props.loadOptions || params.isPending()) {
      return
    }

    params.start()

    let callbackCalled = false
    const callback = (err: Error | string | null | undefined, result?: unknown) => {
      if (callbackCalled) return
      callbackCalled = true
      if (err) {
        params.fail(err)
      } else {
        params.succeed(result)
      }
      params.end()
    }

    const loadArgs: Record<string, unknown> = {
      instanceId: getInstanceId(),
      action: params.action,
      ...params.args,
      callback: (err?: Error | string, result?: unknown) => {
        callback(err ?? null, result)
      },
    }
    const result = props.loadOptions(loadArgs as Parameters<NonNullable<typeof props.loadOptions>>[0])

    if (isPromise(result)) {
      result.then((options) => {
        callback(null, options)
      }, (err: Error | string) => {
        callback(err)
      }).catch((err: Error) => {
        console.error(err)
      })
    }
  }

  function loadRootOptions(): void {
    callLoadOptionsProp({
      action: LOAD_ROOT_OPTIONS,
      isPending: () => rootOptionsStates.isLoading,
      start: () => {
        rootOptionsStates.isLoading = true
        rootOptionsStates.loadingError = ''
      },
      succeed: () => {
        rootOptionsStates.isLoaded = true
        nextTick(() => {
          menuComposable.resetHighlightedOptionWhenNecessary(true)
        })
      },
      fail: (err) => {
        rootOptionsStates.loadingError = getErrorMessage(err)
      },
      end: () => {
        rootOptionsStates.isLoading = false
      },
    })
  }

  function loadChildrenOptions(parentNode: TreeselectNode): void {
    const { id, raw } = parentNode

    callLoadOptionsProp({
      action: LOAD_CHILDREN_OPTIONS,
      args: {
        parentNode: raw,
      },
      isPending: () => {
        const node = forestComposable.getNode(id)
        return node ? node.childrenStates.isLoading : false
      },
      start: () => {
        const node = forestComposable.getNode(id)
        if (node) {
          node.childrenStates.isLoading = true
          node.childrenStates.loadingError = ''
        }
      },
      succeed: () => {
        const node = forestComposable.getNode(id)
        if (node) node.childrenStates.isLoaded = true
        forestComposable.initialize()
      },
      fail: (err) => {
        const node = forestComposable.getNode(id)
        if (node) node.childrenStates.loadingError = getErrorMessage(err)
      },
      end: () => {
        const node = forestComposable.getNode(id)
        if (node) node.childrenStates.isLoading = false
      },
    })
  }

  // =========================================================================
  // Event Handlers
  // =========================================================================

  function handleMouseDown(evt: MouseEvent): void {
    if (evt.type === 'mousedown' && (evt as MouseEvent).button !== 0) return
    evt.preventDefault()
    evt.stopPropagation()

    if (props.disabled) return

    const controlEl = menuComposable.getControl()
    let menuOpened = false
    if (controlEl && controlEl.contains(evt.target as Node)) {
      if (!menu.isOpen && (props.openOnClick || trigger.isFocused)) {
        menuComposable.openMenu()
        menuComposable.focusInput()
        menuOpened = true
      }
    }

    // Only apply blurOnSelect logic if menu was not just opened
    // If menu is opened, input should remain focused for keyboard navigation
    if (!menuOpened) {
      if (selectionComposable.getBlurOnSelect()) {
        menuComposable.blurInput()
      } else {
        menuComposable.focusInput()
      }
    }

    selectionComposable.resetFlags()
  }

  // =========================================================================
  // Watchers
  // =========================================================================

  watch(() => menuComposable.pendingLoadChildren.value, (node) => {
    if (node) {
      loadChildrenOptions(node)
    }
  })

  watch(() => props.alwaysOpen, (newValue) => {
    if (newValue) menuComposable.openMenu()
    else menuComposable.closeMenu()
  })

  watch(() => props.branchNodesFirst, () => {
    forestComposable.initialize()
  })

  watch(() => props.disabled, (newValue) => {
    if (newValue && menu.isOpen) menuComposable.closeMenu()
    else if (!newValue && !menu.isOpen && props.alwaysOpen) menuComposable.openMenu()
  })

  watch(() => props.flat, () => {
    forestComposable.initialize()
  })

  watch(internalValue, (newValue, oldValue) => {
    const hasChanged = quickDiff(newValue, oldValue)
    if (hasChanged) {
      emit('input', getValue(), getInstanceId())
      emit('update:modelValue', getValue(), getInstanceId())
    }
  })

  watch(() => props.matchKeys, () => {
    forestComposable.initialize()
  })

  watch(() => props.multiple, (newValue) => {
    if (newValue) forestComposable.buildForestState()
  })

  watch(() => props.options, () => {
    if (props.async) return
    forestComposable.initialize()
    rootOptionsStates.isLoaded = Array.isArray(props.options)
  }, { deep: true, immediate: true })

  // Set up debounced search handlers to improve performance
  const debouncedHandleLocalSearch = debounce(
    () => searchComposable.handleLocalSearch(),
    INPUT_DEBOUNCE_DELAY,
  )

  const debouncedHandleRemoteSearch = debounce(
    () => searchComposable.handleRemoteSearch(),
    INPUT_DEBOUNCE_DELAY,
  )

  watch(() => trigger.searchQuery, (newQuery) => {
    // Emit search-change immediately for responsive UI
    emit('search-change', trigger.searchQuery, getInstanceId())

    // Debounce the actual search filtering for performance
    if (newQuery) {
      if (props.async) {
        debouncedHandleRemoteSearch()
      } else {
        debouncedHandleLocalSearch()
      }
    } else {
      // Clear search immediately (no debounce) when emptying the input
      debouncedHandleLocalSearch.cancel()
      debouncedHandleRemoteSearch.cancel()
      if (props.async) {
        searchComposable.handleRemoteSearch()
      } else {
        searchComposable.handleLocalSearch()
      }
    }
  })

  watch(() => props.value, () => {
    const nodeIdsFromValue = forestComposable.extractCheckedNodeIdsFromValue()
    const hasChanged = quickDiff(nodeIdsFromValue, internalValue.value)
    if (hasChanged) forestComposable.fixSelectedNodeIds(nodeIdsFromValue)
  })

  // =========================================================================
  // Lifecycle
  // =========================================================================

  function setup(): void {
    forestComposable.verifyProps()
    selectionComposable.resetFlags()
  }

  function onMount(): void {
    if (props.autoFocus) menuComposable.focusInput()
    if (!props.options && !props.async && props.autoLoadRootOptions) loadRootOptions()
    if (props.alwaysOpen) menuComposable.openMenu()
    if (props.async && props.defaultOptions) searchComposable.handleRemoteSearch()
  }

  function onUnmount(): void {
    menuComposable.toggleClickOutsideEvent(false)
  }

  // =========================================================================
  // Wrapper Class Computation
  // =========================================================================

  const wrapperClass = computed(() => {
    const classes: Record<string, boolean> = {
      'vue-treeselect': true,
      'vue-treeselect--single': !props.multiple,
      'vue-treeselect--multi': !!props.multiple,
      'vue-treeselect--searchable': !!props.searchable,
      'vue-treeselect--disabled': !!props.disabled,
      'vue-treeselect--focused': trigger.isFocused,
      'vue-treeselect--has-value': hasValue.value,
      'vue-treeselect--open': menu.isOpen,
      'vue-treeselect--open-above': menu.placement === 'top',
      'vue-treeselect--open-below': menu.placement === 'bottom',
      'vue-treeselect--branch-nodes-first': !!props.branchNodesFirst,
    }
    return classes
  })

  return {
    trigger,
    menu,
    forest,
    rootOptionsStates,
    localSearch,
    remoteSearch,

    // Computed
    internalValue,
    selectedNodes,
    hasValue,
    single,
    hasVisibleOptions,
    showCountOnSearchComputed,
    hasBranchNodes,
    shouldFlattenOptions,
    hasNoOptions,
    hasNoSearchResults,
    wrapperClass,

    // Core methods
    getInstanceId,
    getValue,

    // Forest
    getNode: forestComposable.getNode,
    isSelected: forestComposable.isSelected,
    getSelectedNodes: forestComposable.getSelectedNodes,
    initialize: forestComposable.initialize,
    buildForestState: forestComposable.buildForestState,
    shouldExpand: forestComposable.shouldExpand,
    shouldOptionBeIncludedInSearchResult: forestComposable.shouldOptionBeIncludedInSearchResult,
    shouldShowOptionInMenu: forestComposable.shouldShowOptionInMenu,
    traverseAllNodesByIndex: forestComposable.traverseAllNodesByIndex,
    extractCheckedNodeIdsFromValue: forestComposable.extractCheckedNodeIdsFromValue,
    fixSelectedNodeIds: forestComposable.fixSelectedNodeIds,
    enhancedNormalizer: forestComposable.enhancedNormalizer,

    // Selection
    select: selectionComposable.select,
    clear: selectionComposable.clear,
    removeLastValue: selectionComposable.removeLastValue,

    // Menu
    openMenu: menuComposable.openMenu,
    closeMenu,
    toggleMenu: menuComposable.toggleMenu,
    toggleExpanded: menuComposable.toggleExpanded,
    focusInput: menuComposable.focusInput,
    blurInput,
    setCurrentHighlightedOption: menuComposable.setCurrentHighlightedOption,
    resetHighlightedOptionWhenNecessary: menuComposable.resetHighlightedOptionWhenNecessary,
    highlightFirstOption: menuComposable.highlightFirstOption,
    highlightPrevOption: menuComposable.highlightPrevOption,
    highlightNextOption: menuComposable.highlightNextOption,
    highlightLastOption: menuComposable.highlightLastOption,
    visibleOptionIds: menuComposable.visibleOptionIds,
    setMenuGetter: menuComposable.setMenuGetter,
    setControlGetter: menuComposable.setControlGetter,
    setInputGetter: menuComposable.setInputGetter,

    // Search
    handleLocalSearch: searchComposable.handleLocalSearch,
    handleRemoteSearch: searchComposable.handleRemoteSearch,
    resetSearchQuery: searchComposable.resetSearchQuery,

    // Async loading
    loadRootOptions,
    loadChildrenOptions,
    callLoadOptionsProp,

    // Events
    handleMouseDown,

    // Lifecycle
    setup,
    onMount,
    onUnmount,
  }
}

export type UseTreeselectReturn = ReturnType<typeof useTreeselect>
