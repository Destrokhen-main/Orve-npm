import { ONode, Props, ONodeOrve } from "../types";
import { typeOf } from "../../usedFunction/typeOf";
import { parser } from "./index";
import { ProxyType, RefProxy } from "../../reactive/type";
import { RefCProxy } from "../../reactive/type";

enum ChildType {
  HTML = "HTML",
  Static = "Static",
  ReactiveStatic = "ReactiveStatic",
  ReactiveComponent = "ReactiveComponent"
}

type Child = {
  type: ChildType,
  value: string | number | RefProxy,
  node: HTMLElement | Text | ChildNode,
  ONode?: ONodeOrve
}

function isHaveAnyArray(ar: Array<() => ONode | string | number | object>) {
  for(let i = 0; i !== ar.length; i++) {
    if( Array.isArray(ar[i])) return true;
  }
  return false;
}

function parseChildren (
  ar: Array<() => ONode | string | number | object>,
  props: Props = null,
  parent: ONodeOrve = null
) {
  if (ar.length > 0) {
    if (isHaveAnyArray(ar)) 
      ar = ar.flat(1);
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
          value: item
        } as Child;
      }
      
      // NOTE static string or nubmer 
      if ( typeNode === "string" || typeNode === "number" ) {
        return {
          type: ChildType.Static,
          value: item
        }
      }

      // NOTE component
      if (typeNode === "object" || typeNode === "function") {
        return parser.call(this, item,  props, parent);
      }

      if (typeNode === ProxyType.Proxy) {
        const proxyType = (item as any).proxyType;
        
        if (proxyType === ProxyType.Ref) {
          return {
            type: ChildType.ReactiveStatic,
            value: item,
            ONode: parent,
          }
        }

        if (proxyType === ProxyType.RefC) {
          const o = item as RefCProxy;
          const object = parser.call(this, o.value, props, parent);
          return {
            type: ChildType.ReactiveComponent,
            value: object,
            proxy: item,
            ONode: parent
          } 
        }
      }
    });
  } else {
    return [];
  }
}

export { parseChildren, Child, ChildType }