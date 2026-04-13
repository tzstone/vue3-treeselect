export function constant<T>(value: T): () => T {
  return function constantFunction() {
    return value;
  };
}
