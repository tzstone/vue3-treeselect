export function setupResizeAndScrollEventListeners(
  $el: HTMLElement,
  listener: () => void
): () => void {
  const $scrollParents = findScrollParents($el)

  window.addEventListener('resize', listener, { passive: true } as EventListenerOptions)
  $scrollParents.forEach(scrollParent => {
    scrollParent.addEventListener('scroll', listener, { passive: true } as EventListenerOptions)
  })

  return function removeEventListeners(): void {
    window.removeEventListener('resize', listener, { passive: true } as EventListenerOptions)
    $scrollParents.forEach($scrollParent => {
      $scrollParent.removeEventListener('scroll', listener, { passive: true } as EventListenerOptions)
    })
  }
}

function findScrollParents($el: HTMLElement): (HTMLElement | Window)[] {
  const $scrollParents: (HTMLElement | Window)[] = []
  let $parent = $el.parentNode as HTMLElement

  while ($parent && $parent.nodeName !== 'BODY' && $parent.nodeType === Node.ELEMENT_NODE) {
    if (isScrollElement($parent)) $scrollParents.push($parent)
    $parent = $parent.parentNode as HTMLElement
  }
  $scrollParents.push(window)

  return $scrollParents
}

function isScrollElement($el: HTMLElement): boolean {
  const { overflow, overflowX, overflowY } = getComputedStyle($el)
  return /(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)
}
