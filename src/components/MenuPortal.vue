<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, ref, watch, type ComputedRef } from 'vue'
import { TRESELECT_INSTANCE_KEY, type TreeselectInstance } from '../types'
import Menu from './Menu.vue'

const instanceRef = inject<ComputedRef<TreeselectInstance>>(TRESELECT_INSTANCE_KEY)
if (!instanceRef) throw new Error('TreeselectInstance not provided')

// Unwrap computed ref for template auto-unwrap
const instance = computed(() => instanceRef.value)

const portalTargetRef = ref<HTMLElement | null>(null)

function getControl(): HTMLElement | null {
  const getter = (instance.value as any).getControl
  if (typeof getter === 'function') return getter()
  return null
}

function updatePosition() {
  const $portalTarget = portalTargetRef.value
  const $control = getControl()
  if (!$portalTarget || !$control) return

  const controlRect = $control.getBoundingClientRect()
  const placement = (instance.value as any).menu?.placement || 'bottom'

  if (placement === 'bottom') {
    $portalTarget.style.top = `${Math.round(controlRect.bottom)}px`
  } else {
    $portalTarget.style.top = `${Math.round(controlRect.top - $portalTarget.offsetHeight)}px`
  }
  $portalTarget.style.left = `${Math.round(controlRect.left)}px`
  $portalTarget.style.width = `${Math.round(controlRect.width)}px`
}

// Setup event handlers
let cleanupResize: (() => void) | null = null
let cleanupScroll: (() => void) | null = null
let resizeObserver: ResizeObserver | null = null

watch(() => instance.value.menuIsOpen, (isOpen) => {
  if (isOpen) {
    nextTick(updatePosition)
    nextTick(() => {
      setupListeners()
    })
  } else {
    cleanupListeners()
  }
})

watch(portalTargetRef, (el) => {
  if (el && instance.value.menuIsOpen) {
    nextTick(updatePosition)
  }
})

function setupListeners() {
  const $portalTarget = portalTargetRef.value
  if (!$portalTarget) return
  const $control = getControl()
  if (!$control) return

  resizeObserver = new ResizeObserver(() => updatePosition())
  resizeObserver.observe($control)
  resizeObserver.observe($portalTarget)

  const handleResize = () => updatePosition()
  const handleScroll = () => updatePosition()

  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('scroll', handleScroll, { passive: true })

  cleanupResize = () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
  }
}

function cleanupListeners() {
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

onBeforeUnmount(() => {
  cleanupListeners()
})
</script>

<template>
  <div v-if="instance.appendToBody" ref="portalTargetRef" class="vue-treeselect__portal-target">
    <Menu />
  </div>
</template>


