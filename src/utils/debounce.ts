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
  let lastCallTime: number | undefined

  const { leading = false } = options || {}

  function invokeFunc(): void {
    if (lastArgs) {
      func.apply(lastThis, lastArgs)
      lastArgs = undefined
      lastThis = undefined
    }
  }

  function shouldInvoke(): boolean {
    return lastCallTime === undefined
  }

  function debounced(this: unknown, ...args: Parameters<T>): void {
    const isInvoking = shouldInvoke()

    lastArgs = args
    lastThis = this
    lastCallTime = Date.now()

    if (isInvoking) {
      if (timeout === null) {
        timeout = setTimeout(() => {
          timeout = null
        }, wait)
        if (leading) {
          invokeFunc()
        }
      } else {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          timeout = null
          invokeFunc()
        }, wait)
      }
    } else if (timeout === null) {
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (leading) {
        invokeFunc()
      }
    }
  }

  debounced.cancel = function cancel(): void {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    lastArgs = undefined
    lastThis = undefined
    lastCallTime = undefined
  }

  return debounced as ((...args: Parameters<T>) => void) & { cancel: () => void }
}
