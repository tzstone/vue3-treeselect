import type { TreeselectProps, TreeselectNode } from '../types'
import { NO_PARENT_NODE, UNCHECKED } from '../constants'
import { removeFromArray, last as getLast } from '../utils'
import type { ForestState } from './useForest'

export function useSelection(
  props: TreeselectProps,
  forest: ForestState,
  getNode: (id: string | number | null | undefined) => TreeselectNode | null,
  isSelected: (node: TreeselectNode) => boolean,
  _getSelectedNodes: () => TreeselectNode[],
  buildForestState: () => void,
  traverseDescendantsBFS: (parent: TreeselectNode, cb: (node: TreeselectNode) => void) => void,
  traverseDescendantsDFS: (parent: TreeselectNode, cb: (node: TreeselectNode) => void) => void,
  internalValue: { value: (string | number)[] },
  emit: (event: string, ...args: unknown[]) => void,
  resetSearchQuery: () => void,
  closeMenu: () => void,
) {
  function select(node: TreeselectNode): void {
    if (props.disabled || node.isDisabled) {
      return
    }

    const single = !props.multiple
    if (single) {
      clear()
    }

    const nextState = props.multiple && !props.flat
      ? forest.checkedStateMap[node.id] === UNCHECKED
      : !isSelected(node)

    if (nextState) {
      _selectNode(node)
    } else {
      _deselectNode(node)
    }

    buildForestState()

    if (nextState) {
      emit('select', node.raw, getInstanceId())
    } else {
      emit('deselect', node.raw, getInstanceId())
    }

    if (nextState && (single || props.clearOnSelect)) {
      resetSearchQuery()
    }

    if (single && props.closeOnSelect) {
      closeMenu()
      if (props.searchable) {
        _blurOnSelect = true
      }
    }
  }

  let _blurOnSelect = false

  function getBlurOnSelect(): boolean {
    return _blurOnSelect
  }

  function resetFlags(): void {
    _blurOnSelect = false
  }

  function clear(): void {
    const hasValue = internalValue.value.length > 0
    if (hasValue) {
      if (!props.multiple || props.allowClearingDisabled) {
        forest.selectedNodeIds = []
      } else {
        forest.selectedNodeIds = forest.selectedNodeIds.filter(nodeId => {
          const n = getNode(nodeId)
          return n && n.isDisabled
        })
      }

      buildForestState()
    }
  }

  function _selectNode(node: TreeselectNode): void {
    const single = !props.multiple
    if (single || props.disableBranchNodes) {
      return addValue(node)
    }

    if (props.flat) {
      addValue(node)

      if (props.autoSelectAncestors) {
        node.ancestors.forEach(ancestor => {
          if (!isSelected(ancestor) && !ancestor.isDisabled) addValue(ancestor)
        })
      } else if (props.autoSelectDescendants) {
        traverseDescendantsBFS(node, descendant => {
          if (!isSelected(descendant) && !descendant.isDisabled) addValue(descendant)
        })
      }

      return
    }

    const isFullyChecked = (
      node.isLeaf ||
      !node.hasDisabledDescendants ||
      props.allowSelectingDisabledDescendants
    )
    if (isFullyChecked) {
      addValue(node)
    }

    if (node.isBranch) {
      traverseDescendantsBFS(node, descendant => {
        if (!descendant.isDisabled || props.allowSelectingDisabledDescendants) {
          addValue(descendant)
        }
      })
    }

    if (isFullyChecked) {
      let curr: TreeselectNode | null = node
      while ((curr = curr.parentNode) !== NO_PARENT_NODE && curr) {
        if (curr.children.every(isSelected)) addValue(curr)
        else break
      }
    }
  }

  function _deselectNode(node: TreeselectNode): void {
    if (props.disableBranchNodes) {
      return removeValue(node)
    }

    if (props.flat) {
      removeValue(node)

      if (props.autoDeselectAncestors) {
        node.ancestors.forEach(ancestor => {
          if (isSelected(ancestor) && !ancestor.isDisabled) removeValue(ancestor)
        })
      } else if (props.autoDeselectDescendants) {
        traverseDescendantsBFS(node, descendant => {
          if (isSelected(descendant) && !descendant.isDisabled) removeValue(descendant)
        })
      }

      return
    }

    let hasUncheckedSomeDescendants = false
    if (node.isBranch) {
      traverseDescendantsDFS(node, descendant => {
        if (!descendant.isDisabled || props.allowSelectingDisabledDescendants) {
          removeValue(descendant)
          hasUncheckedSomeDescendants = true
        }
      })
    }

    if (
      node.isLeaf ||
      hasUncheckedSomeDescendants ||
      node.children.length === 0
    ) {
      removeValue(node)

      let curr: TreeselectNode | null = node
      while ((curr = curr.parentNode) !== NO_PARENT_NODE && curr) {
        if (isSelected(curr)) removeValue(curr)
        else break
      }
    }
  }

  function addValue(node: TreeselectNode): void {
    forest.selectedNodeIds.push(node.id)
    forest.selectedNodeMap[node.id] = true
  }

  function removeValue(node: TreeselectNode): void {
    removeFromArray(forest.selectedNodeIds, node.id)
    delete forest.selectedNodeMap[node.id]
  }

  function removeLastValue(): void {
    if (internalValue.value.length === 0) return
    if (!props.multiple) return clear()
    const lastValue = getLast(internalValue.value)
    if (lastValue == null) return
    const lastSelectedNode = getNode(lastValue)
    if (lastSelectedNode) select(lastSelectedNode)
  }

  function getInstanceId(): string | number {
    return props.instanceId ?? ''
  }

  return {
    select,
    clear,
    removeLastValue,
    resetFlags,
    getBlurOnSelect,
    addValue,
    removeValue,
    getInstanceId,
    _selectNode,
    _deselectNode,
  }
}
