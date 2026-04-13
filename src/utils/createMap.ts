export function createMap<T = unknown>(): Record<string, T> {
  return Object.create(null) as Record<string, T>;
}
