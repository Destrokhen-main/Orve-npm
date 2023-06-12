import { ONode, Props } from "../types";
import { typeOf } from "../../usedFunction/typeOf";
import { parser } from "./index";
import { ProxyType, RefProxy, Proxy } from "../../reactive/type";
import { RefCProxy } from "../../reactive/type";
import { isNodeBoolean } from "./validator";
import { generationID } from "../../usedFunction/keyGeneration";
import { checkerEffect } from "../mount/props";
import { Effect } from "../../reactive/effect";
import { UtilsRef, UtilsRefA } from "../../reactive/type";

enum ChildType {
  HTML = "HTML",
  Static = "Static",
  ReactiveStatic = "ReactiveStatic",
  ReactiveComponent = "ReactiveComponent",
  ReactiveArray = "ReactiveArray",
  Effect = "Effect",
  Oif = "Oif",
  HTMLPROP = "HTMLPROP"
}

type Child = {
  type: ChildType;
  value: string | number | RefProxy;
  node: HTMLElement | Text | ChildNode;
  ONode?: ONode;
};

function isHaveAnyArray(ar: Array<() => any>) {
  for (let i = 0; i !== ar.length; i++) {
    if (Array.isArray(ar[i])) return true;
  }
  return false;
}

function isFormatObj(obj: unknown): boolean {
  if (typeof obj === "object") {
    const knowObj = obj as Record<string, any>;
    if (knowObj["type"] !== undefined && Object.values(UtilsRef).includes(knowObj["type"])) {
      return true;
    }
  }
  return false;
}

function isArrayFormatObj(obj: unknown): boolean {
  if (typeof obj === "object") {
    const knowObj = obj as Record<string, any>;
    if (knowObj["type"] !== undefined && Object.values(UtilsRefA).includes(knowObj["type"])) {
      return true;
    }
  }
  return false;
}

function ProxyBulder(item: any, props: Props | null, parent: ONode | null) {
  const proxyType: string = (item as Proxy).proxyType;

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
    let list: any[] = item.value;

    if (item.renderFunction !== null) {
      list = list.map(item.renderFunction);
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
    const call = checkerEffect(item as Effect);

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
    const keyNode = generationID(8);
    (item as any).parentNode = parent;
    (item as any).keyNode = keyNode;
    return {
      type: ChildType.Oif,
      value: item,
      parent,
      keyNode
    }
  }
}

function parseChildren(
  ar: Array<() => any>,
  props: Props | null = null,
  parent: ONode | null = null,
  isArray = false,
) {
  if (ar.length > 0) {
    if (isHaveAnyArray(ar)) ar = ar.flat(1);
    return ar.map((item: any): any => {
      const typeNode = typeOf(item);

      // NOTE if html code
      if (parent !== null && parent.html) {
        return {
          type: ChildType.HTMLPROP,
          value: item,
        }
      }
      
      // NOTE NEED REGEXP
      if (
        typeof item === "string" &&
        item.includes("<") &&
        item.includes(">") &&
        (item.includes("</") || item.includes("/>"))
      ) {
        return {
          type: ChildType.HTML,
          value: item,
        };
      }
      
      if (typeNode === "null" || typeNode === "undefined" || typeNode === "boolean") {
        return {
          type: ChildType.Static,
          value: String(item),
        }
      }

      // NOTE static string or nubmer
      if (typeNode === "string" || typeNode === "number") {
        return {
          type: ChildType.Static,
          value: String(item),
        };
      }
      if (typeNode === "object" && isFormatObj(item)) {
        return {
          type: ChildType.ReactiveStatic,
          value: item.proxy,
          ONode: parent,
          formate: item.formate
        }
      }
      if (typeNode === "object" && isArrayFormatObj(item)) {
        let list: any[] = item.proxy.value;

        if (item.formate !== null) {
          list = list.map(item.formate);
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
          keyNode: generationID(8),
          proxy: item.proxy,
          ONode: parent,
          formate: item.formate
        }
      }
      // NOTE component
      if ((typeNode === "object" || typeNode === "function") && !isArray) {
        return parser.call(this, item as () => any | Record<string, any>, props, parent);
      } else if (isArray) {
        if (typeof item === "object") {
          if (isNodeBoolean(item as Record<string, any>)) {
            return parser.call(this, item as () => any | Record<string, any>, props, parent);
          } else {
            return {
              type: ChildType.Static,
              value: JSON.stringify(item),
            };
          }
        }
      }

      if (typeNode === ProxyType.Proxy) {
        return ProxyBulder.call(this, item, props, parent);
      }
    });
  } else {
    return [];
  }
}

export { parseChildren, Child, ChildType };
