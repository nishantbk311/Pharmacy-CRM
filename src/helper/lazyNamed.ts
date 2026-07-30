import { ComponentType, lazy } from "react";

export function lazyNamed<
  T extends Record<string, ComponentType<any>>,
  K extends keyof T
>(loader: () => Promise<T>, name: K) {
  return lazy(async () => {
    const module = await loader();
    return {
      default: module[name],
    };
  });
}