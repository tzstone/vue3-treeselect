<script setup lang="ts">
/**
 * Option Component
 *
 * Renders a tree option with checkbox, expand/collapse, and recursive children rendering.
 * This is a recursive component that renders itself for child nodes.
 */

import { computed, inject, useSlots, type ComputedRef } from 'vue'
import { UNCHECKED, INDETERMINATE, CHECKED } from '../constants'
import { TRESELECT_INSTANCE_KEY, type TreeselectNode, type TreeselectInstance } from '../types'
import { onLeftClick } from '../utils'
import ArrowIcon from './icons/Arrow.vue'
import Tip from './Tip.vue'

// Props
interface OptionProps {
  /** The node to render */
  node: TreeselectNode
}

const props = defineProps<OptionProps>()

// Inject treeselect instance
const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)

if (!instanceRef) {
  throw new Error('Option component must be used within a Treeselect component')
}

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

// Slots
const slots = useSlots()

// Computed
const shouldExpand = computed(() => {
  return props.node.isBranch && instance.value.shouldExpand(props.node)
})

const shouldShow = computed(() => {
  return instance.value.shouldShowOptionInMenu(props.node)
})

const checkedState = computed(() => {
  return instance.value.forest.checkedStateMap[props.node.id]
})

const shouldShowCount = computed(() => {
  return (
    props.node.isBranch &&
    (instance.value.localSearch.active
      ? instance.value.showCountOnSearchComputed
      : instance.value.showCount)
  )
})

const count = computed(() => {
  if (!shouldShowCount.value) return NaN

  return instance.value.localSearch.active
    ? instance.value.localSearch.countMap[props.node.id][instance.value.showCountOf]
    : props.node.count[instance.value.showCountOf]
})

const hasCustomLabelRenderer = computed(() => {
  return !!slots['option-label']
})

const hasLoadedChildren = computed(() => {
  return props.node.childrenStates.isLoaded
})

const hasChildren = computed(() => {
  return props.node.children.length > 0
})

const isLoadingChildren = computed(() => {
  return props.node.childrenStates.isLoading
})

const hasLoadingError = computed(() => {
  return !!props.node.childrenStates.loadingError
})

// Methods
function handleMouseEnterOption(evt: MouseEvent) {
  // Equivalent to `self` modifier.
  if (evt.target !== evt.currentTarget) return

  instance.value.setCurrentHighlightedOption(props.node, false)
}

function handleMouseDownOnArrow(evt: MouseEvent) {
  onLeftClick(() => {
    instance.value.toggleExpanded(props.node)
  })(evt)
}

function handleMouseDownOnLabelContainer(evt: MouseEvent) {
  onLeftClick(() => {
    if (props.node.isBranch && instance.value.disableBranchNodes) {
      instance.value.toggleExpanded(props.node)
    } else {
      instance.value.select(props.node)
    }
  })(evt)
}

function handleMouseDownOnRetry(evt: MouseEvent) {
  onLeftClick(() => {
    instance.value.loadChildrenOptions(props.node)
  })(evt)
}
</script>

<template>
  <div
    :class="{
      'vue-treeselect__list-item': true,
      [`vue-treeselect__indent-level-${instance.shouldFlattenOptions ? 0 : node.level}`]: true,
    }"
  >
    <!-- Option -->
    <div
      :class="{
        'vue-treeselect__option': true,
        'vue-treeselect__option--disabled': node.isDisabled,
        'vue-treeselect__option--selected': instance.isSelected(node),
        'vue-treeselect__option--highlight': node.isHighlighted,
        'vue-treeselect__option--matched': instance.localSearch.active && node.isMatched,
        'vue-treeselect__option--hide': !shouldShow,
      }"
      :data-id="node.id"
      @mouseenter="handleMouseEnterOption"
    >
      <!-- Arrow -->
      <template v-if="!instance.shouldFlattenOptions || !shouldShow">
        <!-- Branch node arrow -->
        <div
          v-if="node.isBranch"
          class="vue-treeselect__option-arrow-container"
          @mousedown="handleMouseDownOnArrow"
        >
          <transition name="vue-treeselect__option-arrow--prepare" appear>
            <ArrowIcon
              :class="{
                'vue-treeselect__option-arrow': true,
                'vue-treeselect__option-arrow--rotated': shouldExpand,
              }"
            />
          </transition>
        </div>

        <!-- Leaf node placeholder (for alignment) -->
        <div
          v-else-if="instance.hasBranchNodes"
          class="vue-treeselect__option-arrow-placeholder"
        >
          &nbsp;
        </div>
      </template>

      <!-- Label container -->
      <div
        class="vue-treeselect__label-container"
        @mousedown="handleMouseDownOnLabelContainer"
      >
        <!-- Checkbox -->
        <div
          v-if="!instance.single && !(instance.disableBranchNodes && node.isBranch)"
          class="vue-treeselect__checkbox-container"
        >
          <span
            :class="{
              'vue-treeselect__checkbox': true,
              'vue-treeselect__checkbox--checked': checkedState === CHECKED,
              'vue-treeselect__checkbox--indeterminate': checkedState === INDETERMINATE,
              'vue-treeselect__checkbox--unchecked': checkedState === UNCHECKED,
              'vue-treeselect__checkbox--disabled': node.isDisabled,
            }"
          >
            <span class="vue-treeselect__check-mark" />
            <span class="vue-treeselect__minus-mark" />
          </span>
        </div>

        <!-- Label -->
        <slot
          v-if="hasCustomLabelRenderer"
          name="option-label"
          :node="node"
          :should-show-count="shouldShowCount"
          :count="count"
          label-class-name="vue-treeselect__label"
          count-class-name="vue-treeselect__count"
        />
        <label v-else class="vue-treeselect__label">
          {{ node.label }}
          <span v-if="shouldShowCount" class="vue-treeselect__count">
            ({{ count }})
          </span>
        </label>
      </div>
    </div>

    <!-- Sub options list -->
    <transition v-if="node.isBranch" name="vue-treeselect__list--transition">
      <div v-if="shouldExpand" class="vue-treeselect__list">
        <!-- Recursive children rendering -->
        <template v-if="hasLoadedChildren">
          <Option
            v-for="childNode in node.children"
            :key="childNode.id"
            :node="childNode"
          />
        </template>

        <!-- No children tip -->
        <Tip
          v-if="hasLoadedChildren && !hasChildren"
          type="no-children"
          icon="warning"
        >
          {{ instance.noChildrenText }}
        </Tip>

        <!-- Loading tip -->
        <Tip
          v-if="isLoadingChildren"
          type="loading"
          icon="loader"
        >
          {{ instance.loadingText }}
        </Tip>

        <!-- Loading error tip -->
        <Tip
          v-if="hasLoadingError"
          type="error"
          icon="error"
        >
          {{ node.childrenStates.loadingError }}
          <a
            class="vue-treeselect__retry"
            :title="instance.retryTitle"
            @mousedown="handleMouseDownOnRetry"
          >
            {{ instance.retryText }}
          </a>
        </Tip>
      </div>
    </transition>
  </div>
</template>
