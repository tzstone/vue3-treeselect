import { nextTick, ref } from "vue";

import type { TreeselectNode, TreeselectProps } from "../types";
import { scrollIntoView } from "../utils";
import type {
  ForestState,
  LocalSearchState,
  MenuState,
  TriggerState,
} from "./useForest";

export function useMenu(
  props: TreeselectProps,
  forest: ForestState,
  menu: MenuState,
  _trigger: TriggerState,
  localSearch: LocalSearchState,
  getNode: (id: string | number | null | undefined) => TreeselectNode | null,
  shouldExpand: (node: TreeselectNode) => boolean,
  shouldShowOptionInMenu: (node: TreeselectNode) => boolean,
  getInstanceId: () => string | number,
  getValue: () => unknown,
  resetSearchQuery: () => void,
  loadRootOptions: () => void,
  emit: (event: string, ...args: unknown[]) => void,
) {
  function setCurrentHighlightedOption(
    node: TreeselectNode,
    scroll = true,
  ): void {
    const prev = menu.current;
    if (prev != null && prev in forest.nodeMap) {
      forest.nodeMap[prev].isHighlighted = false;
    }

    menu.current = node.id;
    node.isHighlighted = true;

    if (menu.isOpen && scroll) {
      const scrollToOption = () => {
        const $menu = getMenu();
        if (!$menu) return;
        const $option = $menu.querySelector(
          `.vue-treeselect__option[data-id="${node.id}"]`,
        ) as HTMLElement | null;
        if ($option) scrollIntoView($menu, $option);
      };

      if (getMenu()) {
        scrollToOption();
      } else {
        nextTick(scrollToOption);
      }
    }
  }

  function resetHighlightedOptionWhenNecessary(forceReset = false): void {
    const { current } = menu;

    if (
      forceReset ||
      current == null ||
      !(current in forest.nodeMap) ||
      !shouldShowOptionInMenu(getNode(current)!)
    ) {
      highlightFirstOption();
    }
  }

  function highlightFirstOption(): void {
    if (!hasVisibleOptions.value) return;

    const first = visibleOptionIds.value[0];
    const node = getNode(first);
    if (node) setCurrentHighlightedOption(node);
  }

  function highlightPrevOption(): void {
    if (!hasVisibleOptions.value) return;

    const prev =
      visibleOptionIds.value.indexOf(menu.current as string | number) - 1;
    if (prev === -1) return highlightLastOption();
    const node = getNode(visibleOptionIds.value[prev]);
    if (node) setCurrentHighlightedOption(node);
  }

  function highlightNextOption(): void {
    if (!hasVisibleOptions.value) return;

    const next =
      visibleOptionIds.value.indexOf(menu.current as string | number) + 1;
    if (next === visibleOptionIds.value.length) return highlightFirstOption();
    const node = getNode(visibleOptionIds.value[next]);
    if (node) setCurrentHighlightedOption(node);
  }

  function highlightLastOption(): void {
    if (!hasVisibleOptions.value) return;

    const lastId = visibleOptionIds.value[visibleOptionIds.value.length - 1];
    const node = getNode(lastId);
    if (node) setCurrentHighlightedOption(node);
  }

  function openMenu(): void {
    if (props.disabled || menu.isOpen) return;
    menu.isOpen = true;
    nextTick(() => resetHighlightedOptionWhenNecessary());
    nextTick(() => restoreMenuScrollPosition());
    if (!props.options && !props.async) loadRootOptions();
    toggleClickOutsideEvent(true);
    emit("open", getInstanceId());
  }

  function closeMenu(): void {
    if (!menu.isOpen || (!props.disabled && props.alwaysOpen)) return;
    saveMenuScrollPosition();
    menu.isOpen = false;
    toggleClickOutsideEvent(false);
    resetSearchQuery();
    emit("close", getValue(), getInstanceId());
  }

  function toggleMenu(): void {
    if (menu.isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function toggleExpanded(node: TreeselectNode): void {
    let nextState: boolean;

    if (localSearch.active) {
      nextState = node.isExpandedOnSearch = !node.isExpandedOnSearch;
      if (nextState) node.showAllChildrenOnSearch = true;
    } else {
      nextState = node.isExpanded = !node.isExpanded;
    }

    if (nextState && !node.childrenStates.isLoaded) {
      // loadChildrenOptions will be handled by useTreeselect
      _pendingLoadChildren.value = node;
    }
  }

  const _pendingLoadChildren = ref<TreeselectNode | null>(null);

  function consumePendingLoadChildren(): TreeselectNode | null {
    const node = _pendingLoadChildren.value;
    _pendingLoadChildren.value = null;
    return node;
  }

  function toggleClickOutsideEvent(enabled: boolean): void {
    if (handleClickOutside) {
      if (enabled) {
        document.addEventListener("mousedown", handleClickOutside, false);
      } else {
        document.removeEventListener("mousedown", handleClickOutside, false);
      }
    }
  }

  let handleClickOutside: ((evt: MouseEvent) => void) | null = (
    evt: MouseEvent,
  ) => {
    const wrapperEl = getControl();
    if (wrapperEl && !wrapperEl.contains(evt.target as Node)) {
      if (menu.isOpen) {
        closeMenu();
        blurInput();
      }
    }
  };

  let _clickOutsideTriggered = false;

  function consumeClickOutside(): boolean {
    const val = _clickOutsideTriggered;
    _clickOutsideTriggered = false;
    return val;
  }

  function setupClickOutsideHandler(wrapperEl: HTMLElement): void {
    handleClickOutside = (evt: MouseEvent) => {
      if (wrapperEl && !wrapperEl.contains(evt.target as Node)) {
        if (menu.isOpen) {
          closeMenu();
          blurInput();
        }
      }
    };
  }

  function saveMenuScrollPosition(): void {
    const $menu = getMenu();
    if ($menu) menu.lastScrollPosition = $menu.scrollTop;
  }

  function restoreMenuScrollPosition(): void {
    const $menu = getMenu();
    if ($menu) $menu.scrollTop = menu.lastScrollPosition;
  }

  function getMenu(): HTMLElement | null {
    // This will be overridden by the component via refs
    return _menuGetter();
  }

  let _menuGetter: () => HTMLElement | null = () => null;

  function setMenuGetter(getter: () => HTMLElement | null): void {
    _menuGetter = getter;
  }

  function getControl(): HTMLElement | null {
    return _controlGetter();
  }

  let _controlGetter: () => HTMLElement | null = () => null;

  function setControlGetter(getter: () => HTMLElement | null): void {
    _controlGetter = getter;
  }

  function getInput(): HTMLInputElement | null {
    return _inputGetter();
  }

  let _inputGetter: () => HTMLInputElement | null = () => null;

  function setInputGetter(getter: () => HTMLInputElement | null): void {
    _inputGetter = getter;
  }

  function focusInput(): void {
    const input = getInput();
    if (input) input.focus();
  }

  function blurInput(): void {
    const input = getInput();
    if (input) input.blur();
  }

  const visibleOptionIds = computedVisibleOptionIds(
    forest,
    localSearch,
    shouldExpand,
    shouldShowOptionInMenu,
  );

  const hasVisibleOptions = computedHasVisibleOptions(visibleOptionIds);

  return {
    openMenu,
    closeMenu,
    toggleMenu,
    toggleExpanded,
    setCurrentHighlightedOption,
    resetHighlightedOptionWhenNecessary,
    highlightFirstOption,
    highlightPrevOption,
    highlightNextOption,
    highlightLastOption,
    focusInput,
    blurInput,
    saveMenuScrollPosition,
    restoreMenuScrollPosition,
    toggleClickOutsideEvent,
    setupClickOutsideHandler,
    consumeClickOutside,
    consumePendingLoadChildren,
    pendingLoadChildren: _pendingLoadChildren,
    visibleOptionIds,
    hasVisibleOptions,
    getMenu,
    getControl,
    setMenuGetter,
    setControlGetter,
    setInputGetter,
    getInput,
    getValueContainer: () => null as HTMLElement | null,
    setValueContainerGetter: (_getter: () => HTMLElement | null) => {},
    setupHandleClickOutside: (handler: (evt: MouseEvent) => void) => {
      handleClickOutside = handler;
    },
  };
}

function computedVisibleOptionIds(
  forest: ForestState,
  localSearch: LocalSearchState,
  shouldExpand: (node: TreeselectNode) => boolean,
  shouldShow: (node: TreeselectNode) => boolean,
) {
  return {
    get value(): (string | number)[] {
      const ids: (string | number)[] = [];
      const walk = (parentNode: { children: TreeselectNode[] }) => {
        parentNode.children.forEach((child) => {
          if (!localSearch.active || shouldShow(child)) {
            ids.push(child.id);
          }
          if (child.isBranch && shouldExpand(child)) {
            walk(child);
          }
        });
      };
      walk({ children: forest.normalizedOptions });
      return ids;
    },
  };
}

function computedHasVisibleOptions(visibleOptionIds: {
  get value(): (string | number)[];
}) {
  return {
    get value(): boolean {
      return visibleOptionIds.value.length !== 0;
    },
  };
}
