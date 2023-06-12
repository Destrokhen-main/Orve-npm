import { createApp } from "./index";
import er, { message } from "./error";
import { Node, Fragment } from "../jsx";
import { isONode } from "./builder/validator";
import { Orve } from "../default";

export function createAppRoot(app: Node | unknown): createApp | undefined {
  // orve Node and Fragment by hight level. (((
  window.orve = { Node, Fragment };
  if (Object.prototype.toString.call(app) !== "[object Object]") return;

  const item: Node = app as Node;

  if (!isONode(item)) {
    er(message.UNSUPPORTED_TYPE_APP);
    return;
  }

  if (item.tag !== undefined && typeof item.tag === "function") {
    const call = item.tag as () => any;
    return createApp(() => call.call(Orve.context));
  }

  return;
}
