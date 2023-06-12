import { Orve } from "../default";

function ucFirst(str: string) {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}

/**
 *
 * @param {string} name - name component on camelCase
 * @param {function} func - Component
 * @returns boolean - true if created will be success, false if it don't be
 */
export function globalComponent(name: string, func: unknown): boolean {
  if (window === undefined) {
    return false;
  }

  if (typeof func !== "function" || name.length === 0) {
    console.warn(
      "The name of the global component must not be an empty string",
    );
    return false;
  }

  const funcName = ucFirst(name);

  const w = window as Record<string, any>;

  if (w[funcName] !== undefined) {
    console.warn(`"${name}" - reserved name`);
    return false;
  } else {
    w[funcName] = func.bind(Orve.context);
  }
  return true;
}
