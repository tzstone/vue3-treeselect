import fuzzysearch from "fuzzysearch";
import { computed } from "vue";

import { createMap, find, includes, isNaN, quickDiff, warning } from "../utils";

import {
  ALL,
  ALL_CHILDREN,
  ALL_DESCENDANTS,
  ALL_WITH_INDETERMINATE,
  BRANCH_PRIORITY,
  CHECKED,
  INDETERMINATE,
  LEAF_CHILDREN,
  LEAF_DESCENDANTS,
  LEAF_PRIORITY,
  NO_PARENT_NODE,
  UNCHECKED,
} from "../constants";

import type {
  CountMap,
  TreeselectNode,
  TreeselectOption,
  TreeselectProps,
} from "../types";

// =============================================================================
// Shared State Types
// =============================================================================

export interface ForestState {
  normalizedOptions: TreeselectNode[];
  nodeMap: Record<string | number, TreeselectNode>;
  checkedStateMap: Record<string | number, number>;
  selectedNodeIds: (string | number)[];
  selectedNodeMap: Record<string | number, boolean>;
}

export interface LocalSearchState {
  active: boolean;
  noResults: boolean;
  countMap: Record<string | number, CountMap>;
}

export interface TriggerState {
  isFocused: boolean;
  searchQuery: string;
}

export interface MenuState {
  isOpen: boolean;
  current: string | number | null;
  lastScrollPosition: number;
  placement: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

function stringifyOptionPropValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" && !isNaN(value)) return value + "";
  return "";
}

function match(
  enableFuzzyMatch: boolean,
  needle: string,
  haystack: string,
): boolean {
  return enableFuzzyMatch
    ? fuzzysearch(needle, haystack)
    : includes(haystack, needle);
}

// =============================================================================
// Composable
// =============================================================================

export function useForest(
  props: TreeselectProps,
  forest: ForestState,
  localSearch: LocalSearchState,
  _emit: (event: string, ...args: unknown[]) => void,
) {
  // ===========================================================================
  // Enhanced Normalizer
  // ===========================================================================

  function enhancedNormalizer(
    raw: TreeselectOption,
  ): TreeselectOption & { id: string | number; label: string } {
    return {
      ...raw,
      ...(props.normalizer ? props.normalizer(raw, getInstanceId()) : raw),
    };
  }

  function getInstanceId(): string | number {
    return props.instanceId ?? "";
  }

  // ===========================================================================
  // Node Retrieval
  // ===========================================================================

  function getNode(
    nodeId: string | number | null | undefined,
  ): TreeselectNode | null {
    warning(
      () => nodeId != null,
      () => [`Invalid node id: ${nodeId}`],
    );

    if (nodeId == null) return null;

    return nodeId in forest.nodeMap
      ? forest.nodeMap[nodeId]
      : createFallbackNode(nodeId);
  }

  function createFallbackNode(id: string | number): TreeselectNode {
    const raw = extractNodeFromValue(id);
    const label = enhancedNormalizer(raw).label || `${id} (unknown)`;
    const fallbackNode: TreeselectNode = {
      id,
      label,
      lowerLabel: label.toLowerCase(),
      lowerCased: { label: label.toLowerCase() },
      nestedSearchLabel: label.toLowerCase(),
      ancestors: [],
      parentNode: null,
      isFallbackNode: true,
      isRootNode: true,
      isLeaf: true,
      isBranch: false,
      isDisabled: false,
      isNew: false,
      isMatched: false,
      isHighlighted: false,
      hasMatchedDescendants: false,
      hasDisabledDescendants: false,
      hasChildren: false,
      hasLoadedChildren: true,
      isExpanded: false,
      isExpandedOnSearch: false,
      showAllChildrenOnSearch: false,
      isLoading: false,
      loadingError: "",
      childrenStates: { isLoaded: false, isLoading: false, loadingError: "" },
      count: {
        ALL_CHILDREN: 0,
        ALL_DESCENDANTS: 0,
        LEAF_CHILDREN: 0,
        LEAF_DESCENDANTS: 0,
      },
      isSelected: false,
      level: 0,
      index: [-1],
      raw,
      children: [],
    };

    forest.nodeMap[id] = fallbackNode;
    return fallbackNode;
  }

  // ===========================================================================
  // Value Extraction
  // ===========================================================================

  function extractCheckedNodeIdsFromValue(): (string | number)[] {
    const value = props.modelValue;
    if (value == null) return [];

    if (props.valueFormat === "id") {
      return props.multiple
        ? (value as (string | number)[]).slice()
        : [value as string | number];
    }

    return (
      props.multiple
        ? (value as TreeselectOption[])
        : [value as TreeselectOption]
    )
      .map((node) => enhancedNormalizer(node))
      .map((node) => node.id);
  }

  function extractNodeFromValue(id: string | number): TreeselectOption {
    const defaultNode: TreeselectOption = { id, label: "" };

    if (props.valueFormat === "id") {
      return defaultNode;
    }

    const value = props.modelValue;
    const valueArray = props.multiple
      ? Array.isArray(value)
        ? (value as TreeselectOption[])
        : []
      : value
        ? [value as TreeselectOption]
        : [];
    const matched = find(
      valueArray,
      (node) => node && enhancedNormalizer(node).id === id,
    );

    return matched || defaultNode;
  }

  // ===========================================================================
  // Selection State Fixing
  // ===========================================================================

  function fixSelectedNodeIds(
    nodeIdListOfPrevValue: (string | number)[],
  ): void {
    let nextSelectedNodeIds: (string | number)[] = [];
    const single = !props.multiple;

    if (
      single ||
      props.flat ||
      props.disableBranchNodes ||
      props.valueConsistsOf === ALL
    ) {
      nextSelectedNodeIds = nodeIdListOfPrevValue;
    } else if (props.valueConsistsOf === BRANCH_PRIORITY) {
      nodeIdListOfPrevValue.forEach((nodeId) => {
        nextSelectedNodeIds.push(nodeId);
        const node = getNode(nodeId);
        if (node && node.isBranch)
          traverseDescendantsBFS(node, (descendant) => {
            nextSelectedNodeIds.push(descendant.id);
          });
      });
    } else if (props.valueConsistsOf === LEAF_PRIORITY) {
      const map = createMap<number>();
      const queue = nodeIdListOfPrevValue.slice();
      while (queue.length) {
        const nodeId = queue.shift()!;
        const node = getNode(nodeId);
        if (!node) continue;
        nextSelectedNodeIds.push(nodeId);
        if (node.isRootNode) continue;
        if (!(node.parentNode!.id in map))
          map[node.parentNode!.id] = node.parentNode!.children.length;
        if (--map[node.parentNode!.id] === 0) queue.push(node.parentNode!.id);
      }
    } else if (props.valueConsistsOf === ALL_WITH_INDETERMINATE) {
      const map = createMap<number>();
      const queue = nodeIdListOfPrevValue.filter((nodeId) => {
        const node = getNode(nodeId);
        return node && (node.isLeaf || node.children.length === 0);
      });
      while (queue.length) {
        const nodeId = queue.shift()!;
        const node = getNode(nodeId);
        if (!node) continue;
        nextSelectedNodeIds.push(nodeId);
        if (node.isRootNode) continue;
        if (!(node.parentNode!.id in map))
          map[node.parentNode!.id] = node.parentNode!.children.length;
        if (--map[node.parentNode!.id] === 0) queue.push(node.parentNode!.id);
      }
    }

    const hasChanged = quickDiff(forest.selectedNodeIds, nextSelectedNodeIds);
    if (hasChanged) forest.selectedNodeIds = nextSelectedNodeIds;

    buildForestState();
  }

  // ===========================================================================
  // Tree Traversal
  // ===========================================================================

  function traverseDescendantsBFS(
    parentNode: TreeselectNode,
    callback: (node: TreeselectNode) => void,
  ): void {
    if (!parentNode.isBranch) return;
    const queue = parentNode.children.slice();
    while (queue.length) {
      const currNode = queue[0];
      if (currNode.isBranch) queue.push(...currNode.children);
      callback(currNode);
      queue.shift();
    }
  }

  function traverseDescendantsDFS(
    parentNode: TreeselectNode,
    callback: (node: TreeselectNode) => void,
  ): void {
    if (!parentNode.isBranch) return;
    parentNode.children.forEach((child) => {
      traverseDescendantsDFS(child, callback);
      callback(child);
    });
  }

  function traverseAllNodesDFS(callback: (node: TreeselectNode) => void): void {
    forest.normalizedOptions.forEach((rootNode) => {
      traverseDescendantsDFS(rootNode, callback);
      callback(rootNode);
    });
  }

  function traverseAllNodesByIndex(
    callback: (node: TreeselectNode) => boolean | void,
  ): void {
    const walk = (parentNode: { children: TreeselectNode[] }) => {
      parentNode.children.forEach((child) => {
        if (callback(child) !== false && child.isBranch) {
          walk(child);
        }
      });
    };

    walk({ children: forest.normalizedOptions });
  }

  // ===========================================================================
  // Forest State Building
  // ===========================================================================

  function buildForestState(): void {
    const selectedNodeMap = createMap<boolean>();
    forest.selectedNodeIds.forEach((selectedNodeId) => {
      selectedNodeMap[selectedNodeId] = true;
    });
    forest.selectedNodeMap = selectedNodeMap;

    const checkedStateMap = createMap<number>();
    if (props.multiple) {
      traverseAllNodesByIndex((node) => {
        checkedStateMap[node.id] = UNCHECKED;
      });

      getSelectedNodes().forEach((selectedNode) => {
        checkedStateMap[selectedNode.id] = CHECKED;

        if (!props.flat && !props.disableBranchNodes) {
          selectedNode.ancestors.forEach((ancestorNode) => {
            if (!isSelected(ancestorNode)) {
              checkedStateMap[ancestorNode.id] = INDETERMINATE;
            }
          });
        }
      });
    }
    forest.checkedStateMap = checkedStateMap;
  }

  // ===========================================================================
  // Node Selection Checks
  // ===========================================================================

  function isSelected(node: TreeselectNode): boolean {
    return forest.selectedNodeMap[node.id] === true;
  }

  function getSelectedNodes(): TreeselectNode[] {
    return forest.selectedNodeIds.map((id) => getNode(id)!).filter(Boolean);
  }

  // ===========================================================================
  // Tree Normalization
  // ===========================================================================

  function checkDuplication(node: TreeselectOption): void {
    warning(
      () =>
        !(node.id in forest.nodeMap && !forest.nodeMap[node.id].isFallbackNode),
      () => [
        `Detected duplicate presence of node id ${JSON.stringify(node.id)}. ` +
          `Their labels are "${forest.nodeMap[node.id].label}" and "${node.label}" respectively.`,
      ],
    );
  }

  function verifyNodeShape(node: TreeselectOption): void {
    warning(
      () => !(node.children === undefined && node.isBranch === true),
      () => [
        "Are you meant to declare an unloaded branch node? " +
          "`isBranch: true` is no longer supported, please use `children: null` instead.",
      ],
    );
  }

  function normalize(
    parentNode: TreeselectNode | null,
    nodes: TreeselectOption[],
    prevNodeMap: Record<string | number, TreeselectNode> | null,
  ): TreeselectNode[] {
    const matchKeys = props.matchKeys || ["label"];
    const defaultExpandLevel = props.defaultExpandLevel ?? 0;

    let normalizedOptions = nodes
      .map((node) => [enhancedNormalizer(node), node] as const)
      .map(([node, raw], index) => {
        checkDuplication(node);
        verifyNodeShape(node);

        const { id, label, children, isDefaultExpanded } = node;
        const isRootNode = parentNode === NO_PARENT_NODE;
        const level = isRootNode ? 0 : parentNode!.level + 1;
        const isBranch = Array.isArray(children) || children === null;
        const isLeaf = !isBranch;
        const isDisabled =
          !!node.isDisabled ||
          (!props.flat &&
            !isRootNode &&
            parentNode != null &&
            parentNode.isDisabled);
        const isNew = !!node.isNew;
        const lowerCased = matchKeys.reduce<Record<string, string>>(
          (prev, key) => ({
            ...prev,
            [key]: stringifyOptionPropValue(
              (node as Record<string, unknown>)[key],
            ).toLocaleLowerCase(),
          }),
          {},
        );
        const nestedSearchLabel = isRootNode
          ? lowerCased.label || ""
          : (parentNode!.nestedSearchLabel || "") +
            " " +
            (lowerCased.label || "");

        const normalized: TreeselectNode = {
          id,
          label: label || "",
          lowerLabel: (label || "").toLowerCase(),
          lowerCased,
          nestedSearchLabel,
          ancestors: isRootNode
            ? []
            : [parentNode!].concat(parentNode!.ancestors),
          index: (isRootNode ? [] : parentNode!.index).concat(index),
          parentNode: isRootNode ? null : parentNode!,
          isFallbackNode: false,
          isRootNode: isRootNode as boolean,
          isLeaf,
          isBranch,
          isDisabled,
          isNew,
          isMatched: false,
          isHighlighted: false,
          hasMatchedDescendants: false,
          hasDisabledDescendants: false,
          hasChildren: isBranch,
          hasLoadedChildren: Array.isArray(children),
          isExpanded: false,
          isExpandedOnSearch: false,
          showAllChildrenOnSearch: false,
          isLoading: false,
          loadingError: "",
          childrenStates: {
            isLoaded: false,
            isLoading: false,
            loadingError: "",
          },
          count: {
            ALL_CHILDREN: 0,
            ALL_DESCENDANTS: 0,
            LEAF_CHILDREN: 0,
            LEAF_DESCENDANTS: 0,
          },
          isSelected: false,
          level,
          raw,
          children: [],
        };

        // Register in nodeMap
        forest.nodeMap[id] = normalized;

        if (isBranch) {
          const isLoaded = Array.isArray(children);

          normalized.childrenStates = {
            isLoaded,
            isLoading: false,
            loadingError: "",
          };
          normalized.isExpanded =
            typeof isDefaultExpanded === "boolean"
              ? isDefaultExpanded
              : level < defaultExpandLevel;
          normalized.hasMatchedDescendants = false;
          normalized.hasDisabledDescendants = false;
          normalized.isExpandedOnSearch = false;
          normalized.showAllChildrenOnSearch = false;
          normalized.count = {
            [ALL_CHILDREN]: 0,
            [ALL_DESCENDANTS]: 0,
            [LEAF_CHILDREN]: 0,
            [LEAF_DESCENDANTS]: 0,
          };
          normalized.children = isLoaded
            ? normalize(normalized, children as TreeselectOption[], prevNodeMap)
            : [];

          if (isDefaultExpanded === true)
            normalized.ancestors.forEach((ancestor) => {
              ancestor.isExpanded = true;
            });

          if (
            !isLoaded &&
            typeof props.loadOptions !== "function" &&
            children === null
          ) {
            warning(
              () => false,
              () => [
                'Unloaded branch node detected. "loadOptions" prop is required to load its children.',
              ],
            );
          }
        }

        normalized.ancestors.forEach(
          (ancestor) => ancestor.count[ALL_DESCENDANTS]++,
        );
        if (isLeaf)
          normalized.ancestors.forEach(
            (ancestor) => ancestor.count[LEAF_DESCENDANTS]++,
          );
        if (!isRootNode && parentNode) {
          parentNode.count[ALL_CHILDREN] += 1;
          if (isLeaf) parentNode.count[LEAF_CHILDREN] += 1;
          if (isDisabled) {
            // Track disabled descendants on parent
          }
        }

        // Preserve previous states.
        if (prevNodeMap && prevNodeMap[id]) {
          const prev = prevNodeMap[id];

          normalized.isMatched = prev.isMatched;
          normalized.showAllChildrenOnSearch = prev.showAllChildrenOnSearch;
          normalized.isHighlighted = prev.isHighlighted;

          if (prev.isBranch && normalized.isBranch) {
            normalized.isExpanded = prev.isExpanded;
            normalized.isExpandedOnSearch = prev.isExpandedOnSearch;
            if (
              prev.childrenStates.isLoaded &&
              !normalized.childrenStates.isLoaded
            ) {
              normalized.isExpanded = false;
            } else {
              normalized.childrenStates = { ...prev.childrenStates };
            }
          }
        }

        return normalized;
      });

    if (props.branchNodesFirst) {
      const branchNodes = normalizedOptions.filter((option) => option.isBranch);
      const leafNodes = normalizedOptions.filter((option) => option.isLeaf);
      normalizedOptions = branchNodes.concat(leafNodes);
    }

    return normalizedOptions;
  }

  // ===========================================================================
  // Initialize
  // ===========================================================================

  function initialize(): void {
    const options = props.async
      ? getRemoteSearchEntry().options
      : props.options;

    if (Array.isArray(options)) {
      const prevNodeMap = forest.nodeMap;
      forest.nodeMap = createMap<TreeselectNode>();
      keepDataOfSelectedNodes(prevNodeMap);
      forest.normalizedOptions = normalize(null, options, prevNodeMap);
      fixSelectedNodeIds(extractCheckedNodeIdsFromValue());
    } else {
      forest.normalizedOptions = [];
    }
  }

  function keepDataOfSelectedNodes(
    prevNodeMap: Record<string | number, TreeselectNode>,
  ): void {
    forest.selectedNodeIds.forEach((id) => {
      if (!prevNodeMap[id]) return;
      const node: TreeselectNode = {
        ...prevNodeMap[id],
        isFallbackNode: true,
      };
      forest.nodeMap[id] = node;
    });
  }

  // ===========================================================================
  // Internal Value Computed
  // ===========================================================================

  const internalValue = computed(() => {
    let result: (string | number)[];
    const single = !props.multiple;

    if (
      single ||
      props.flat ||
      props.disableBranchNodes ||
      props.valueConsistsOf === ALL
    ) {
      result = forest.selectedNodeIds.slice();
    } else if (props.valueConsistsOf === BRANCH_PRIORITY) {
      result = forest.selectedNodeIds.filter((id) => {
        const node = getNode(id);
        if (!node) return false;
        if (node.isRootNode) return true;
        return node.parentNode && !isSelected(node.parentNode);
      });
    } else if (props.valueConsistsOf === LEAF_PRIORITY) {
      result = forest.selectedNodeIds.filter((id) => {
        const node = getNode(id);
        if (!node) return false;
        if (node.isLeaf) return true;
        return node.children.length === 0;
      });
    } else if (props.valueConsistsOf === ALL_WITH_INDETERMINATE) {
      const indeterminateNodeIds: (string | number)[] = [];
      result = forest.selectedNodeIds.slice();
      getSelectedNodes().forEach((selectedNode) => {
        selectedNode.ancestors.forEach((ancestor) => {
          if (includes(indeterminateNodeIds, ancestor.id)) return;
          if (includes(result, ancestor.id)) return;
          indeterminateNodeIds.push(ancestor.id);
        });
      });
      result.push(...indeterminateNodeIds);
    } else {
      result = forest.selectedNodeIds.slice();
    }

    if (props.sortValueBy === "LEVEL") {
      result.sort((a, b) => sortValueByLevel(getNode(a)!, getNode(b)!));
    } else if (props.sortValueBy === "INDEX") {
      result.sort((a, b) => sortValueByIndex(getNode(a)!, getNode(b)!));
    }

    return result;
  });

  function sortValueByIndex(a: TreeselectNode, b: TreeselectNode): number {
    let i = 0;
    do {
      if (a.level < i) return -1;
      if (b.level < i) return 1;
      if (a.index[i] !== b.index[i]) return a.index[i] - b.index[i];
      i++;
    } while (true);
  }

  function sortValueByLevel(a: TreeselectNode, b: TreeselectNode): number {
    return a.level === b.level ? sortValueByIndex(a, b) : a.level - b.level;
  }

  // ===========================================================================
  // Remote Search Entry (stub - used by initialize, real impl in useSearch)
  // ===========================================================================

  // This will be overridden by useSearch via a setter
  let _getRemoteSearchEntry: () => {
    options: TreeselectOption[];
    isLoaded: boolean;
    isLoading: boolean;
    loadingError: string;
  } = () => ({
    options: [],
    isLoaded: false,
    isLoading: false,
    loadingError: "",
  });

  function setGetRemoteSearchEntry(fn: typeof _getRemoteSearchEntry): void {
    _getRemoteSearchEntry = fn;
  }

  function getRemoteSearchEntry(): {
    options: TreeselectOption[];
    isLoaded: boolean;
    isLoading: boolean;
    loadingError: string;
  } {
    return _getRemoteSearchEntry();
  }

  // ===========================================================================
  // Should Expand / Should Show
  // ===========================================================================

  function shouldExpand(node: TreeselectNode): boolean {
    return localSearch.active ? node.isExpandedOnSearch : node.isExpanded;
  }

  function shouldOptionBeIncludedInSearchResult(node: TreeselectNode): boolean {
    if (node.isMatched) return true;
    if (
      node.isBranch &&
      node.hasMatchedDescendants &&
      !props.flattenSearchResults
    )
      return true;
    if (
      !node.isRootNode &&
      node.parentNode &&
      node.parentNode.showAllChildrenOnSearch
    )
      return true;
    return false;
  }

  function shouldShowOptionInMenu(node: TreeselectNode): boolean {
    if (localSearch.active && !shouldOptionBeIncludedInSearchResult(node)) {
      return false;
    }
    return true;
  }

  // ===========================================================================
  // Verify Props
  // ===========================================================================

  function verifyProps(): void {
    warning(
      () => (props.async ? !!props.searchable : true),
      () => [
        'For async search mode, the value of "searchable" prop must be true.',
      ],
    );

    if (props.options == null && !props.loadOptions) {
      warning(
        () => false,
        () => [
          'Are you meant to dynamically load options? You need to use "loadOptions" prop.',
        ],
      );
    }

    if (props.flat) {
      warning(
        () => !!props.multiple,
        () => [
          'You are using flat mode. But you forgot to add "multiple=true"?',
        ],
      );
    }

    if (!props.flat) {
      const propNames = [
        "autoSelectAncestors",
        "autoSelectDescendants",
        "autoDeselectAncestors",
        "autoDeselectDescendants",
      ] as const;

      propNames.forEach((propName) => {
        warning(
          () => !props[propName],
          () => [`"${propName}" only applies to flat mode.`],
        );
      });
    }
  }

  return {
    // State
    forest,

    // Node operations
    getNode,
    createFallbackNode,
    extractCheckedNodeIdsFromValue,
    extractNodeFromValue,
    fixSelectedNodeIds,
    isSelected,
    getSelectedNodes,
    enhancedNormalizer,

    // Tree traversal
    traverseDescendantsBFS,
    traverseDescendantsDFS,
    traverseAllNodesDFS,
    traverseAllNodesByIndex,

    // Normalization
    normalize,
    initialize,
    buildForestState,
    keepDataOfSelectedNodes,

    // Checks
    shouldExpand,
    shouldOptionBeIncludedInSearchResult,
    shouldShowOptionInMenu,

    // Internal value
    internalValue,
    sortValueByIndex,
    sortValueByLevel,

    // Remote search entry hook
    setGetRemoteSearchEntry,
    getRemoteSearchEntry,

    // Props verification
    verifyProps,
    getInstanceId,

    // Utility (exposed for search composable)
    match,
    stringifyOptionPropValue,
  };
}
