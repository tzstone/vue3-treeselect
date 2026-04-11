export function includes(arrOrStr: unknown[] | string, elem: unknown): boolean {
  return arrOrStr.indexOf(elem as string) !== -1
}
