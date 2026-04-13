import fuzzysearch from "fuzzysearch";
import {
  ALL_CHILDREN,
  ALL_DESCENDANTS,
  ASYNC_SEARCH,
  LEAF_CHILDREN,
  LEAF_DESCENDANTS,
} from "../constants";
import type {
  TreeselectNode,
  TreeselectOption,
  TreeselectProps,
} from "../types";
import { includes } from "../utils";
import type { ForestState, LocalSearchState, TriggerState } from "./useForest";

interface RemoteSearchEntry {
  isLoaded: boolean;
  isLoading: boolean;
  loadingError: string;
  options: TreeselectOption[];
}

function createAsyncOptionsStates(): {
  isLoaded: boolean;
  isLoading: boolean;
  loadingError: string;
} {
  return {
    isLoaded: false,
    isLoading: false,
    loadingError: "",
  };
}

function getErrorMessage(err: Error | string): string {
  return (err instanceof Error ? err.message : String(err)) || "";
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

export function useSearch(
  props: TreeselectProps,
  _forest: ForestState,
  localSearch: LocalSearchState,
  trigger: TriggerState,
  remoteSearch: Record<string, RemoteSearchEntry>,
  _getNode: (id: string | number | null | undefined) => TreeselectNode | null,
  traverseAllNodesDFS: (cb: (node: TreeselectNode) => void) => void,
  _shouldExpand: (node: TreeselectNode) => boolean,
  initialize: () => void,
  resetHighlightedOptionWhenNecessary: (force?: boolean) => void,
  _getInstanceId: () => string | number,
  callLoadOptionsProp: (params: {
    action: string;
    args?: Record<string, unknown>;
    isPending: () => boolean;
    start: () => void;
    succeed: (result?: unknown) => void;
    fail: (err: Error | string) => void;
    end: () => void;
  }) => void,
  _emit: (event: string, ...args: unknown[]) => void,
) {
  function handleLocalSearch(): void {
    const { searchQuery } = trigger;
    const done = () => resetHighlightedOptionWhenNecessary(true);

    if (!searchQuery) {
      localSearch.active = false;
      return done();
    }

    localSearch.active = true;
    localSearch.noResults = true;

    traverseAllNodesDFS((node) => {
      if (node.isBranch) {
        node.isExpandedOnSearch = false;
        node.showAllChildrenOnSearch = false;
        node.isMatched = false;
        node.hasMatchedDescendants = false;
        localSearch.countMap[node.id] = {
          ALL_CHILDREN: 0,
          ALL_DESCENDANTS: 0,
          LEAF_CHILDREN: 0,
          LEAF_DESCENDANTS: 0,
        };
      }
    });

    const lowerCasedSearchQuery = searchQuery.trim().toLocaleLowerCase();
    const splitSearchQuery = lowerCasedSearchQuery
      .replace(/\s+/g, " ")
      .split(" ");

    traverseAllNodesDFS((node) => {
      if (props.searchNested && splitSearchQuery.length > 1) {
        node.isMatched = splitSearchQuery.every((filterValue) =>
          match(false, filterValue, node.nestedSearchLabel),
        );
      } else {
        const matchKeys = props.matchKeys || ["label"];
        node.isMatched = matchKeys.some((matchKey) =>
          match(
            !props.disableFuzzyMatching,
            lowerCasedSearchQuery,
            node.lowerCased[matchKey],
          ),
        );
      }

      if (node.isMatched) {
        localSearch.noResults = false;
        node.ancestors.forEach(
          (ancestor) => localSearch.countMap[ancestor.id][ALL_DESCENDANTS]++,
        );
        if (node.isLeaf)
          node.ancestors.forEach(
            (ancestor) => localSearch.countMap[ancestor.id][LEAF_DESCENDANTS]++,
          );
        if (node.parentNode != null) {
          localSearch.countMap[node.parentNode.id][ALL_CHILDREN] += 1;
          if (node.isLeaf)
            localSearch.countMap[node.parentNode.id][LEAF_CHILDREN] += 1;
        }
      }

      if (
        (node.isMatched || (node.isBranch && node.isExpandedOnSearch)) &&
        node.parentNode != null
      ) {
        node.parentNode.isExpandedOnSearch = true;
        node.parentNode.hasMatchedDescendants = true;
      }
    });

    done();
  }

  function handleRemoteSearch(): void {
    const { searchQuery } = trigger;
    const entry = getRemoteSearchEntry();
    const done = () => {
      initialize();
      resetHighlightedOptionWhenNecessary(true);
    };

    if ((searchQuery === "" || props.cacheOptions) && entry.isLoaded) {
      return done();
    }

    callLoadOptionsProp({
      action: ASYNC_SEARCH,
      args: { searchQuery },
      isPending() {
        return entry.isLoading;
      },
      start: () => {
        entry.isLoading = true;
        entry.isLoaded = false;
        entry.loadingError = "";
      },
      succeed: (options) => {
        entry.isLoaded = true;
        entry.options = options as TreeselectOption[];
        if (trigger.searchQuery === searchQuery) done();
      },
      fail: (err) => {
        entry.loadingError = getErrorMessage(err);
      },
      end: () => {
        entry.isLoading = false;
      },
    });
  }

  function getRemoteSearchEntry(): RemoteSearchEntry {
    const { searchQuery } = trigger;
    const existing = remoteSearch[searchQuery];
    const entry: RemoteSearchEntry = existing
      ? { ...existing }
      : {
          ...createAsyncOptionsStates(),
          options: [],
        };

    if (searchQuery === "") {
      if (Array.isArray(props.defaultOptions)) {
        entry.options = props.defaultOptions as TreeselectOption[];
        entry.isLoaded = true;
        return entry;
      } else if (props.defaultOptions !== true) {
        entry.isLoaded = true;
        return entry;
      }
    }

    if (!remoteSearch[searchQuery]) {
      remoteSearch[searchQuery] = entry;
    }

    return remoteSearch[searchQuery];
  }

  function resetSearchQuery(): void {
    trigger.searchQuery = "";
  }

  return {
    handleLocalSearch,
    handleRemoteSearch,
    getRemoteSearchEntry,
    resetSearchQuery,
  };
}

export type { RemoteSearchEntry };
