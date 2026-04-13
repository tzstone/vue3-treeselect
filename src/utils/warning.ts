import { noop } from "./noop";

export const warning =
  process.env.NODE_ENV === "production"
    ? /* istanbul ignore next */ noop
    : function warning(
        checker: () => boolean,
        complainer: () => string[],
      ): void {
        if (!checker()) {
          const message = ["[Vue-Treeselect Warning]"].concat(complainer());

          console.error(...message);
        }
      };
