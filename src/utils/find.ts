export function find<T>(
  arr: T[],
  predicate: (item: T, index: number, arr: T[]) => boolean,
  ctx?: unknown,
): T | undefined {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (predicate.call(ctx, arr[i], i, arr)) return arr[i];
  }
  return undefined;
}
