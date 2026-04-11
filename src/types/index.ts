/**
 * Barrel export for vue3-treeselect types
 *
 * This file re-exports all type definitions for convenient importing.
 */

export type {
  // Core Option and Node Types
  TreeselectOption,
  TreeselectNode,
  TreeselectForestState,
  CountMap,
  ChildrenStates,
  RemoteSearchEntry,

  // Constants (Type Aliases)
  ValueConsistsOf,
  ShowCountOf,
  SortValueBy,
  OpenDirection,
  ValueFormat,

  // Props, Events, Slots
  TreeselectProps,
  TreeselectEmits,
  TreeselectSlots,
  OptionLabelSlotProps,
  ValueLabelSlotProps,

  // Component Instance
  TreeselectPublicMethods,
  TreeselectInstance,

  // Type Utilities
  TreeselectValue,
} from './treeselect'

export { TRESELECT_INSTANCE_KEY } from './treeselect'
