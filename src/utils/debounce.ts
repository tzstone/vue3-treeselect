interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options?: DebounceOptions
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | undefined
  let lastThis: unknown | undefined

  const { leading = false } = options || {}

  function invokeFunc(): void {
    if (lastArgs) {
      func.apply(lastThis, lastArgs)
      lastArgs = undefined
      lastThis = undefined
    }
  }

  function debounced(this: unknown, ...args: Parameters<T>): void {
    lastArgs = args
    lastThis = this

    if (timeout !== null) {
      clearTimeout(timeout)
    }

    if (leading && timeout === null) {
      invokeFunc()
    }

    timeout = setTimeout(() => {
      timeout = null
      if (!leading) {
        invokeFunc()
      }
    }, wait)
  }

  debounced.cancel = function cancel(): void {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    lastArgs = undefined
    lastThis = undefined
  }

  return debounced as ((...args: Parameters<T>) => void) & { cancel: () => void }
}
