import { ONode, Props, ONodeOrve } from "../types";
import { typeOf } from "../../usedFunction/typeOf";
import { parser } from "./index";
import { ProxyType, RefProxy } from "../../reactive/type";
import { RefCProxy } from "../../reactive/type";
import { isNodeBoolean } from "./validator";
import { generationID } from "../../usedFunction/keyGeneration";
import { checkerEffect } from "../mount/props";
import { ref } from "../../reactive/ref";

enum ChildType {
  HTML = "HTML",
  Static = "Static",
  ReactiveStatic = "ReactiveStatic",
  ReactiveComponent = "ReactiveComponent",
  ReactiveArray = "ReactiveArray",
  Effect = "Effect",
  Oif = "Oif"
}

type Child = {
  type: ChildType;
  value: string | number | RefProxy;
  node: HTMLElement | Text | ChildNode;
  ONode?: ONodeOrve;
};

function isHaveAnyArray(ar: Array<() => ONode | string | number | object>) {
  for (let i = 0; i !== ar.length; i++) {
    if (Array.isArray(ar[i])) return true;
  }
  return false;
}

function parseChildren(
  ar: Array<() => ONode | string | number | object>,
  props: Props = null,
  parent: ONodeOrve = null,
  isArray = false,
) {
  if (ar.length > 0) {
    if (isHaveAnyArray(ar)) ar = ar.flat(1);
    return ar.map((item: ONode | string | number | object) => {
      const typeNode = typeOf(item);
      // NOTE if html code
      if (
        typeof item === "string" &&
        item.includes("<") &&
        item.includes(">") &&
        (item.includes("</") || item.includes("/>"))
      ) {
        return {
          type: ChildType.HTML,
          value: item,
        } as Child;
      }

      // NOTE static string or nubmer
      if (typeNode === "string" || typeNode === "number") {
        return {
          type: ChildType.Static,
          value: item,
        };
      }

      // NOTE component
      if ((typeNode === "object" || typeNode === "function") && !isArray) {
        return parser.call(this, item, props, parent);
      } else if (isArray) {
        if (isNodeBoolean(item as object)) {
          return parser.call(this, item, props, parent);
        } else {
          return {
            type: ChildType.Static,
            value: JSON.stringify(item),
          };
        }
      }

      if (typeNode === ProxyType.Proxy) {
        const proxyType = (item as any).proxyType;

        if (proxyType === ProxyType.Ref) {
          return {
            type: ChildType.ReactiveStatic,
            value: item,
            ONode: parent,
          };
        }

        if (proxyType === ProxyType.RefC) {
          const o = item as RefCProxy;
          const object = parser.call(this, o.value, props, parent);
          return {
            type: ChildType.ReactiveComponent,
            value: object,
            proxy: item,
            ONode: parent,
          };
        }

        if (proxyType === ProxyType.RefA) {
          let list = (item as any).value;

          if ((item as any).renderFunction !== null) {
            list = list.map((item as any).renderFunction);
          }

          return {
            type: ChildType.ReactiveArray,
            value: parseChildren.call(
              this,
              list,
              props,
              parent,
              true,
            ),
            proxy: item,
            parent,
            keyNode: generationID(8),
          };
        }

        if (proxyType === ProxyType.Effect) {
          const call = checkerEffect(item);

          const [ res ] = parseChildren.call(this, [ call ], props, parent);
          return {
            type: ChildType.Effect,
            proxy: item,
            value: res,
            parent,
            keyNode: generationID(8),
          };
        }

        if (proxyType === ProxyType.Oif) {
          (item as any).parentNode = parent;
          return {
            type: ChildType.Oif,
            value: item,
            parent,
            keyNode: generationID(8)
          }
        }
      }
    });
  } else {
    return [];
  }
}

export { parseChildren, Child, ChildType };
