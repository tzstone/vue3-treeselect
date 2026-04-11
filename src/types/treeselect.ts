/**
 * Type definitions for vue3-treeselect component
 *
 * This file contains all TypeScript type definitions for the vue3-treeselect component,
 * including props, events, slots, and public methods.
 */

import type { InjectionKey, ComputedRef } from 'vue'

// =============================================================================
// Core Option and Node Types
// =============================================================================

/**
 * Raw option data provided by the user
 * This represents the input format for options
 */
export interface TreeselectOption {
  /** Unique identifier for the option */
  id: string | number
  /** Display label for the option */
  label: string
  /** Child options (for branch nodes) */
  children?: TreeselectOption[]
  /** Whether this node should be expanded by default */
  isDefaultExpanded?: boolean
  /** Whether this node is disabled and cannot be selected */
  isDisabled?: boolean
  /** Whether this is a newly created option (for creating new options) */
  isNew?: boolean
  /** Whether this is a leaf node (has no children) */
  isLeaf?: boolean
  /** Any additional properties for custom data */
  [key: string]: any
}

/**
 * Count map for tracking matched children/descendants during search
 */
export interface CountMap {
  /** Count of all direct children */
  ALL_CHILDREN: number
  /** Count of all descendants (children, grandchildren, etc.) */
  ALL_DESCENDANTS: number
  /** Count of leaf children */
  LEAF_CHILDREN: number
  /** Count of leaf descendants */
  LEAF_DESCENDANTS: number
}

/**
 * Children state for async loading
 */
export interface ChildrenStates {
  /** Whether children have been loaded */
  isLoaded: boolean
  /** Whether children are currently being loaded */
  isLoading: boolean
  /** Error message if loading failed */
  loadingError: string
}

/**
 * Internal normalized node
 * This is the internal representation used by the component
 */
export interface TreeselectNode {
  /** Unique identifier */
  id: string | number
  /** Display label */
  label: string
  /** Lowercase version of label for search matching */
  lowerLabel: string
  /** Lowercase versions of all searchable properties */
  lowerCased: Record<string, string>
  /** Combined lowercase label for nested search */
  nestedSearchLabel: string
  /** Whether this is a leaf node (no children) */
  isLeaf: boolean
  /** Whether this is a branch node (has children) */
  isBranch: boolean
  /** Whether this node is disabled */
  isDisabled: boolean
  /** Whether this is a newly created option */
  isNew: boolean
  /** Whether this node matches the current search query */
  isMatched: boolean
  /** Whether this node is currently highlighted */
  isHighlighted: boolean
  /** Whether this node has any matched descendants */
  hasMatchedDescendants: boolean
  /** Whether this node has any disabled descendants */
  hasDisabledDescendants: boolean
  /** Whether this node has children */
  hasChildren: boolean
  /** Whether this node's children have been loaded */
  hasLoadedChildren: boolean
  /** Whether this node is expanded */
  isExpanded: boolean
  /** Whether this node is expanded during search */
  isExpandedOnSearch: boolean
  /** Whether to show all children during search */
  showAllChildrenOnSearch: boolean
  /** Whether this node is currently loading */
  isLoading: boolean
  /** Error message if loading failed */
  loadingError: string
  /** Children loading state */
  childrenStates: ChildrenStates
  /** Count of children/descendants */
  count: CountMap
  /** Whether this node is selected */
  isSelected: boolean
  /** Hierarchy level (0 for root nodes) */
  level: number
  /** Index in the tree at each level */
  index: number[]
  /** Ancestor nodes (parent, grandparent, etc.) */
  ancestors: TreeselectNode[]
  /** Parent node (null for root nodes) */
  parentNode: TreeselectNode | null
  /** Whether this is a root node */
  isRootNode: boolean
  /** Whether this is a fallback node (not in actual options) */
  isFallbackNode: boolean
  /** Child nodes */
  children: TreeselectNode[]
  /** Raw option data from user */
  raw: TreeselectOption
}

/**
 * Forest state containing the normalized tree structure
 */
export interface TreeselectForestState {
  /** Normalized root options */
  normalizedOptions: TreeselectNode[]
  /** Map of node ID to node for fast lookup */
  nodeMap: Record<string | number, TreeselectNode>
  /** Map of node ID to checked state (multi-select mode) */
  checkedStateMap: Record<string | number, 'UNCHECKED' | 'INDETERMINATE' | 'CHECKED'>
  /** List of selected node IDs */
  selectedNodeIds: (string | number)[]
  /** Map for fast checking if a node is selected */
  selectedNodeMap: Record<string | number, boolean>
}

/**
 * Remote search entry for caching async search results
 */
export interface RemoteSearchEntry {
  /** Whether search results are loaded */
  isLoaded: boolean
  /** Whether currently loading */
  isLoading: boolean
  /** Error message if loading failed */
  loadingError: string
  /** Options returned from search */
  options: TreeselectOption[]
}

// =============================================================================
// Constants
// =============================================================================

/** ValueConsistsOf options */
export type ValueConsistsOf = 'ALL' | 'BRANCH_PRIORITY' | 'LEAF_PRIORITY' | 'ALL_WITH_INDETERMINATE'

/** ShowCountOf options */
export type ShowCountOf = 'ALL_CHILDREN' | 'ALL_DESCENDANTS' | 'LEAF_CHILDREN' | 'LEAF_DESCENDANTS'

/** SortValueBy options */
export type SortValueBy = 'ORDER_SELECTED' | 'LEVEL' | 'INDEX'

/** OpenDirection options */
export type OpenDirection = 'auto' | 'top' | 'bottom' | 'above' | 'below'

/** ValueFormat options */
export type ValueFormat = 'id' | 'object'

// =============================================================================
// Props
// =============================================================================

/**
 * All props for the Treeselect component
 */
export interface TreeselectProps {
  /** Whether to allow resetting value even if there are disabled selected nodes */
  allowClearingDisabled?: boolean
  /** When an ancestor node is selected/deselected, whether its disabled descendants should be selected/deselected */
  allowSelectingDisabledDescendants?: boolean
  /** Whether the menu should be always open */
  alwaysOpen?: boolean
  /** Append the menu to <body />? */
  appendToBody?: boolean
  /** Whether to enable async search mode */
  async?: boolean
  /** Automatically focus the component on mount? */
  autoFocus?: boolean
  /** Automatically load root options on mount */
  autoLoadRootOptions?: boolean
  /** When user deselects a node, automatically deselect its ancestors (flat mode only) */
  autoDeselectAncestors?: boolean
  /** When user deselects a node, automatically deselect its descendants (flat mode only) */
  autoDeselectDescendants?: boolean
  /** When user selects a node, automatically select its ancestors (flat mode only) */
  autoSelectAncestors?: boolean
  /** When user selects a node, automatically select its descendants (flat mode only) */
  autoSelectDescendants?: boolean
  /** Whether pressing backspace key removes the last item if there is no text input */
  backspaceRemoves?: boolean
  /** Function that processes before clearing all input fields. Return false to prevent clearing */
  beforeClearAll?: () => boolean | Promise<boolean>
  /** Show branch nodes before leaf nodes? */
  branchNodesFirst?: boolean
  /** Should cache results of every search request? */
  cacheOptions?: boolean
  /** Show an "×" button that resets value? */
  clearable?: boolean
  /** Title for the "×" button when multiple: true */
  clearAllText?: string
  /** Whether to clear the search input after selecting (multi-select mode) */
  clearOnSelect?: boolean
  /** Title for the "×" button */
  clearValueText?: string
  /** Whether to close the menu after selecting an option (multi-select mode) */
  closeOnSelect?: boolean
  /** How many levels of branch nodes should be automatically expanded when loaded */
  defaultExpandLevel?: number
  /** The default set of options to show before the user starts searching (async search mode) */
  defaultOptions?: boolean | TreeselectOption[]
  /** Whether pressing delete key removes the last item if there is no text input */
  deleteRemoves?: boolean
  /** Delimiter to use to join multiple values for the hidden field value */
  delimiter?: string
  /** Only show the nodes that match the search value directly, excluding its ancestors */
  flattenSearchResults?: boolean
  /** Prevent branch nodes from being selected? */
  disableBranchNodes?: boolean
  /** Disable the control? */
  disabled?: boolean
  /** Disable the fuzzy matching functionality? */
  disableFuzzyMatching?: boolean
  /** Whether to enable flat mode */
  flat?: boolean
  /** Will be passed with all events as the last param for identifying events origin */
  instanceId?: string | number
  /** Joins multiple values into a single form field with the delimiter (legacy mode) */
  joinValues?: boolean
  /** Limit the display of selected options */
  limit?: number
  /** Function that processes the message shown when selected elements pass the defined limit */
  limitText?: (count: number) => string
  /** Text displayed when loading options */
  loadingText?: string
  /** Used for dynamically loading options */
  loadOptions?: (args: {
    action: string
    callback: (err?: Error | string) => void
    parentNode?: TreeselectNode
    instanceId: string | number
  }) => void
  /** Which node properties to filter on */
  matchKeys?: string[]
  /** Sets maxHeight style value of the menu */
  maxHeight?: number
  /** Set true to allow selecting multiple options (multi-select mode) */
  multiple?: boolean
  /** Generates a hidden <input /> tag with this field name for html forms */
  name?: string
  /** Text displayed when a branch node has no children */
  noChildrenText?: string
  /** Text displayed when there are no available options */
  noOptionsText?: string
  /** Text displayed when there are no matching search results */
  noResultsText?: string
  /** Used for normalizing source data */
  normalizer?: (node: TreeselectOption, instanceId: string | number) => TreeselectOption
  /** Which direction to open the menu */
  openDirection?: OpenDirection
  /** Whether to automatically open the menu when the control is clicked */
  openOnClick?: boolean
  /** Whether to automatically open the menu when the control is focused */
  openOnFocus?: boolean
  /** Array of available options */
  options?: TreeselectOption[]
  /** Field placeholder, displayed when there's no value */
  placeholder?: string
  /** Applies HTML5 required attribute when needed */
  required?: boolean
  /** Text displayed asking user whether to retry loading children options */
  retryText?: string
  /** Title for the retry button */
  retryTitle?: string
  /** Enable searching feature? */
  searchable?: boolean
  /** Search in ancestor nodes too */
  searchNested?: boolean
  /** Text tip to prompt for async search */
  searchPromptText?: string
  /** Whether to show a children count next to the label of each branch node */
  showCount?: boolean
  /** Used in conjunction with showCount to specify which type of count number should be displayed */
  showCountOf?: ShowCountOf
  /** Whether to show children count when searching */
  showCountOnSearch?: boolean | null
  /** In which order the selected options should be displayed in trigger & sorted in value array */
  sortValueBy?: SortValueBy
  /** Tab index of the control */
  tabIndex?: number
  /** The value of the control */
  value?: string | number | TreeselectOption | (string | number | TreeselectOption)[]
  /** Which kind of nodes should be included in the value array in multi-select mode */
  valueConsistsOf?: ValueConsistsOf
  /** Format of value prop */
  valueFormat?: ValueFormat
  /** z-index of the menu */
  zIndex?: number | string
}

// =============================================================================
// Events
// =============================================================================

/**
 * All events emitted by the Treeselect component
 */
export interface TreeselectEmits {
  /** Emitted when the selected value changes */
  (event: 'input', value: any, instanceId: string | number): void
  /** Emitted when the search query changes */
  (event: 'search-change', searchQuery: string, instanceId: string | number): void
  /** Emitted when an option is selected */
  (event: 'select', node: TreeselectOption, instanceId: string | number): void
  /** Emitted when an option is deselected */
  (event: 'deselect', node: TreeselectOption, instanceId: string | number): void
  /** Emitted when the menu opens */
  (event: 'open', instanceId: string | number): void
  /** Emitted when the menu closes */
  (event: 'close', instanceId: string | number): void
}

// =============================================================================
// Slots
// =============================================================================

/**
 * Props for the option-label slot
 */
export interface OptionLabelSlotProps {
  /** The current option node */
  node: TreeselectNode
  /** Whether to show the count */
  shouldShowCount: boolean
  /** The count number */
  count: number
  /** CSS class name for the label element */
  labelClassName: string
  /** CSS class name for the count element */
  countClassName: string
}

/**
 * Props for the value-label slot
 */
export interface ValueLabelSlotProps {
  /** The selected node */
  node: TreeselectNode
}

/**
 * All scoped slots for the Treeselect component
 */
export interface TreeselectSlots {
  /** Slot before the option list */
  'before-list': () => any
  /** Slot after the option list */
  'after-list': () => any
  /** Custom label renderer for each option */
  'option-label': (props: OptionLabelSlotProps) => any
  /** Custom label renderer for selected values */
  'value-label': (props: ValueLabelSlotProps) => any
}

// =============================================================================
// Public Methods (Component Instance)
// =============================================================================

/**
 * Public methods exposed by the Treeselect component
 */
export interface TreeselectPublicMethods {
  /** Opens the menu */
  openMenu(): void
  /** Closes the menu */
  closeMenu(): void
  /** Clears the selected value */
  clear(): void
  /** Focuses the input field */
  focusInput(): void
  /** Blurs the input field */
  blurInput(): void
  /** Gets the selected node(s) */
  getSelectedNodes(): TreeselectNode[]
  /** Gets a node by ID */
  getNode(nodeId: string | number): TreeselectNode | null
  /** Checks if a node is selected */
  isSelected(node: TreeselectNode): boolean
  /** Toggles menu open/close */
  toggleMenu(): void
  /** Toggles the expanded state of a node */
  toggleExpanded(node: TreeselectNode): void
  /** Selects a node */
  select(node: TreeselectNode): void
  /** Loads children options for a node */
  loadChildrenOptions(node: TreeselectNode): void
}

/**
 * Full Treeselect component instance type
 * Combines public methods with internal state
 */
export interface TreeselectInstance extends TreeselectPublicMethods {
  /** Whether the control is focused */
  isFocused: boolean
  /** Current search query */
  searchQuery: string
  /** Whether the menu is open */
  menuIsOpen: boolean
  /** Current highlighted option ID */
  currentHighlightedOptionId: string | number | null
  /** Selected nodes */
  selectedNodes: TreeselectNode[]
  /** Whether any option has been selected */
  hasValue: boolean
  /** Whether in single-select mode */
  single: boolean
  /** Whether in multi-select mode */
  multiple: boolean
  /** Whether any branch node exists */
  hasBranchNodes: boolean
  /** Map of node ID to checked state (multi-select mode) */
  checkedStateMap: Record<string | number, number>
  /** Local search state */
  localSearch: {
    /** Whether search is active */
    active: boolean
    /** Map of node ID to count of matched children */
    countMap: Record<string | number, CountMap>
  }
  /** Whether to show children count next to the label */
  showCount: boolean
  /** Which type of count to display */
  showCountOf: ShowCountOf
  /** Whether to show children count when searching */
  showCountOnSearchComputed: boolean
  /** Text displayed when a branch node has no children */
  noChildrenText: string
  /** Text displayed when loading options */
  loadingText: string
  /** Title for the retry button */
  retryTitle: string
  /** Text displayed asking user whether to retry loading children options */
  retryText: string
  /** Whether to flatten search results */
  shouldFlattenOptions: boolean
  /** Check if a node should be expanded */
  shouldExpand(node: TreeselectNode): boolean
  /** Check if an option should be shown in the menu */
  shouldShowOptionInMenu(node: TreeselectNode): boolean
  /** Set the current highlighted option */
  setCurrentHighlightedOption(node: TreeselectNode, shouldAutoScroll?: boolean): void
  /** Remove the last selected value */
  removeLastValue(): void
  /** Whether the control is disabled */
  disabled: boolean
  /** Whether searching is enabled */
  searchable: boolean
  /** Placeholder text */
  placeholder: string
  /** Whether to automatically open the menu when the control is focused */
  openOnFocus: boolean
  /** Automatically focus the component on mount */
  autoFocus: boolean
  /** Tab index of the control */
  tabIndex: number
  /** Whether pressing backspace key removes the last item if there is no text input */
  backspaceRemoves: boolean
  /** Whether pressing delete key removes the last item if there is no text input */
  deleteRemoves: boolean
  /** Show an "×" button that resets value */
  clearable: boolean
  /** Whether to allow resetting value even if there are disabled selected nodes */
  allowClearingDisabled: boolean
  /** Whether the menu should be always open */
  alwaysOpen: boolean
  /** Title for the "×" button when multiple: true */
  clearAllText: string
  /** Title for the "×" button */
  clearValueText: string
  /** Limit the display of selected options */
  limit: number
  /** Function that processes the message shown when selected elements pass the defined limit */
  limitText: (count: number) => string
  /** Generates a hidden <input /> tag with this field name for html forms */
  name?: string
  /** The value of the control */
  value?: string | number | (string | number)[]
  /** Format of value prop */
  valueFormat: 'id' | 'object'
  /** Delimiter to use to join multiple values for the hidden field value */
  delimiter: string
  /** Maximum height of the menu in pixels */
  maxHeight: number
  /** z-index of the menu */
  zIndex: number | string
  /** Whether to append menu to body */
  appendToBody: boolean
  /** Whether using async search mode */
  async: boolean
  /** Root options loading state */
  rootOptionsStates: {
    /** Whether root options have been loaded */
    isLoaded: boolean
    /** Whether root options are currently being loaded */
    isLoading: boolean
    /** Error message if loading failed */
    loadingError: string
  }
  /** Forest state with normalized options */
  forest: {
    /** Normalized options array */
    normalizedOptions: TreeselectNode[]
  }
  /** Remote search entries cache */
  remoteSearch: Record<string, {
    /** Whether search results have been loaded */
    isLoaded: boolean
    /** Whether search is currently loading */
    isLoading: boolean
    /** Error message if search failed */
    loadingError: string
    /** Search result options */
    options: TreeselectOption[]
  }>
  /** Text displayed when there are no options available */
  noOptionsText: string
  /** Text displayed when there are no search results */
  noResultsText: string
  /** Text displayed to prompt for async search */
  searchPromptText: string
  /** Gets the remote search entry for current query */
  getRemoteSearchEntry(): {
    isLoaded: boolean
    isLoading: boolean
    loadingError: string
    options: TreeselectOption[]
  }
  /** Loads root options asynchronously */
  loadRootOptions(): void
  /** Handles remote search */
  handleRemoteSearch(): void
  /** Handles mouse down events */
  handleMouseDown(evt: MouseEvent): void
  /** Menu placement (top/bottom) */
  menu: {
    /** Current placement */
    placement: string
  }
  /** Direction in which the menu should open */
  openDirection: 'auto' | 'top' | 'bottom' | 'above' | 'below'
  /** Gets the menu DOM element */
  getMenu(): HTMLElement | null
  /** Gets the control DOM element */
  getControl(): HTMLElement | null
  /** Applies HTML5 required attribute when needed */
  required?: boolean
  /** Prevent branch nodes from being selected */
  disableBranchNodes?: boolean
  /** Trigger control state */
  trigger: {
    /** Whether the control is focused */
    isFocused: boolean
    /** Current search query */
    searchQuery: string
  }
  /** Highlights the last option in the menu */
  highlightLastOption?(): void
  /** Highlights the first option in the menu */
  highlightFirstOption?(): void
  /** Highlights the previous option in the menu */
  highlightPrevOption?(): void
  /** Highlights the next option in the menu */
  highlightNextOption?(): void
  /** Function that processes before clearing all input fields */
  beforeClearAll?: () => boolean | Promise<boolean>
  /** Internal value array */
  internalValue?: (string | number)[]
  /** Joins multiple values into a single form field with the delimiter */
  joinValues?: boolean
  /** The default set of options to show before the user starts searching */
  defaultOptions?: boolean | TreeselectOption[]
  /** Control element reference */
  control?: {
    [key: string]: any
  }
}

// =============================================================================
// Injection Keys
// =============================================================================

/**
 * Injection key for accessing the Treeselect instance from child components
 */
export const TRESELECT_INSTANCE_KEY: InjectionKey<ComputedRef<TreeselectInstance>> = Symbol('treeselect-instance')

// =============================================================================
// Type Utilities
// =============================================================================

/**
 * Extract the value type based on props configuration
 */
export type TreeselectValue<P extends TreeselectProps> = P['multiple'] extends true
  ? P['valueFormat'] extends 'object'
    ? TreeselectOption[]
    : (string | number)[]
  : P['valueFormat'] extends 'object'
    ? TreeselectOption | null
    : string | number | null
