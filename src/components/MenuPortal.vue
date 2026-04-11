<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type ComputedRef } from 'vue'
import { TRESELECT_INSTANCE_KEY, type TreeselectInstance } from '../types'
import { inject } from 'vue'

const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)
if (!instanceRef) throw new Error('TreeselectInstance not provided')

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

const portalTargetRef = ref<HTMLElement | null>(null)
const controlRef = computed(() => (instance.value as any).control)
// const menuRef = computed(() => (instance as any).menu)

function getControl(): HTMLElement | null {
  if (!controlRef.value) return null
  return typeof controlRef.value.$el === 'object' ? controlRef.value.$el : controlRef.value
}

function updatePosition() {
  const $portalTarget = portalTargetRef.value
  const $control = getControl()
  if (!$portalTarget || !$control) return

  // const controlRect = $control.getBoundingClientRect()
  // const portalTargetRect = $portalTarget.getBoundingClientRect()
  // const placement = (instance as any).menu?.placement || 'bottom'
  // const offsetY = placement === 'bottom' ? controlRect.height : 0

  // const left = Math.round(controlRect.left - portalTargetRect.left) + 'px'
  // const top = Math.round(controlRect.top - portalTargetRect.top + offsetY) + 'px'

  // Menu container will be available after Task 11
  // const menuContainer = menuRef.value?.$el?.querySelector('.vue-treeselect__menu-container')
  // if (!menuContainer) return

  // Find the correct transform property for cross-browser support
  // const transformVariations = ['transform', 'webkitTransform', 'MozTransform', 'msTransform']
  // const transform = transformVariations.find(t => t in document.body.style)

  // Will be used after Task 11 when Menu component is available
  // if (transform) {
  //   ;(menuContainer as any).style[transform] = `translate(${left}, ${top})`
  // }
}

// Setup event handlers
let cleanupResize: (() => void) | null = null
let cleanupScroll: (() => void) | null = null
let resizeObserver: ResizeObserver | null = null

watch(() => instance.value.menuIsOpen, (isOpen) => {
  if (isOpen) {
    // Setup resize observer
    const $portalTarget = portalTargetRef.value
    if ($portalTarget) {
      const $control = getControl()
      if ($control) {
        resizeObserver = new ResizeObserver(() => updatePosition())
        resizeObserver.observe($control)
        resizeObserver.observe($portalTarget)

        // Setup scroll listeners
        const handleResize = () => updatePosition()
        const handleScroll = () => updatePosition()

        window.addEventListener('resize', handleResize, { passive: true })
        window.addEventListener('scroll', handleScroll, { passive: true })

        cleanupResize = () => {
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('scroll', handleScroll)
        }
      }
    }
  } else {
    // Cleanup
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (cleanupResize) {
      cleanupResize()
      cleanupResize = null
    }
    if (cleanupScroll) {
      cleanupScroll()
      cleanupScroll = null
    }
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (cleanupResize) {
    cleanupResize()
  }
  if (cleanupScroll) {
    cleanupScroll()
  }
})
</script>

<template>
  <div v-if="instance.appendToBody" ref="portalTargetRef" class="vue-treeselect__portal-target" />
</template>

<style scoped>
.vue-treeselect__portal-target {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>
