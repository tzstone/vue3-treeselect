interface Size {
  width: number;
  height: number;
}

export function watchSize(
  $el: HTMLElement,
  listener: (size: Size) => void,
): () => void {
  if (typeof ResizeObserver === "undefined") {
    console.warn("ResizeObserver is not supported in this browser");
    return () => {};
  }

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      listener({ width, height });
    }
  });

  observer.observe($el);

  return () => observer.disconnect();
}
