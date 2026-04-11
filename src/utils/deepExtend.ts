function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value == null || typeof value !== 'object') return false
  return Object.getPrototypeOf(value) === Object.prototype
}

function copy(obj: Record<string, unknown>, key: string, value: unknown): void {
  if (isPlainObject(value)) {
    obj[key] || (obj[key] = {})
    deepExtend(obj[key] as Record<string, unknown>, value)
  } else {
    obj[key] = value
  }
}

export function deepExtend(target: Record<string, unknown>, source: unknown): Record<string, unknown> {
  if (isPlainObject(source)) {
    const keys = Object.keys(source)

    for (let i = 0, len = keys.length; i < len; i++) {
      copy(target, keys[i], source[keys[i]])
    }
  }

  return target
}
