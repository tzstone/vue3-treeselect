export function isPromise(value: unknown): value is Promise<unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    "then" in value &&
    typeof (value as Promise<unknown>).then === "function"
  );
}
