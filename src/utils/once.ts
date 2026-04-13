export function once<T extends (...args: unknown[]) => unknown>(func: T): T {
  let called = false;
  let result: unknown;

  return ((...args: Parameters<T>): unknown => {
    if (!called) {
      called = true;
      result = func(...args);
    }
    return result;
  }) as T;
}
