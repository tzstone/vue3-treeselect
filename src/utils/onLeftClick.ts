export function onLeftClick<T = unknown>(
  mouseDownHandler: (evt: MouseEvent, ...args: T[]) => void,
) {
  return function onMouseDown(
    this: unknown,
    evt: MouseEvent,
    ...args: T[]
  ): void {
    if (evt.type === "mousedown" && evt.button === 0) {
      mouseDownHandler.call(this, evt, ...args);
    }
  };
}
