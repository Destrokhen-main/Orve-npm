import { ProxyType, RefCProxy } from "./type";
import { ChildType } from "../dom/builder/children";
import { parser } from "../dom/builder/index";
import { mountedNode } from "../dom/mount/index";
import { HookObject } from "../dom/types";
import { HookObjectType } from "../dom/types";
import { isEqual } from "../usedFunction/isEqual";
import { Orve } from "../default";
import { typeOf } from "../usedFunction/typeOf";
import { parseChildren } from "../dom/builder/children";
import { childF } from "../dom/mount/child";

function updatedHook(item: any, type: HookObjectType) {
  if (item.hooks && item.hooks?.updated !== undefined) {
    item.hooks.updated({
      context: Orve.context,
      oNode: item,
      type,
    } as HookObject);
  }
}

function checkExistParents(ar: any): any {
  const nArr: any = [];
  ar.forEach((e: any) => {
    if (e.type !== ChildType.ReactiveComponent) {
      nArr.push(e);
      return;
    }
    if (document.body.contains(e.ONode.node)) nArr.push(e);
  });

  return nArr;
}

function refC(app: () => any | object | null = null) {
  let block = app;
  if (app === null) {
    block = () => ({ tag: "comment", child: "refC" });
  }

  if (typeof block !== "function") {
    block = () => block;
  }

  const object = {
    parent: [],
    value: block,
    type: ProxyType.Proxy,
    proxyType: ProxyType.RefC,
  } as RefCProxy;

  return new Proxy<RefCProxy>(object, {
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.RefC;
      if (prop in target) {
        return target[prop];
      }
      return undefined;
    },

    set(target, prop, value) {
      if (prop in target) {
        if (prop === "value") {
          let comp = value;
          if (comp === undefined || comp === "" || comp === null) {
            comp = () => ({ tag: "comment", child: "refC" });
          }
          if (target.parent.length > 0) {
            const typeInsertBlock = typeOf(comp);
            target.parent = target.parent.map((item) => {
              if (item.type === ChildType.ReactiveComponent) {
                if (typeInsertBlock === "object" || typeInsertBlock === "function") {
                  if (typeInsertBlock === "object") {
                    comp = () => value;
                  }
                  const parsedItem = parser.call(
                    Orve.context,
                    comp,
                    null,
                    item.parent,
                  );
                  const element = mountedNode.call(
                    Orve.context,
                    null,
                    parsedItem,
                  );
                  if (!isEqual(element, item.ONode)) {
                    item.ONode.node.replaceWith(element.node);
                    item.ONode = element;
                    updatedHook(item.ONode.parent, HookObjectType.Component);
                  }
                  return item;
                } else if (typeInsertBlock === "string" || typeInsertBlock === "number") {
                  const parsedAr = parseChildren.call(Orve.context, [ value ], null, item.parent);
                  const [ element ] = childF.call(Orve.context, null, parsedAr);
                  item.ONode.node.replaceWith(element.node);
                  item.ONode = element;
                  updatedHook(item.parent, HookObjectType.Component);
                  return item;
                }
              }
              if (item.type === ProxyType.Watch) {
                item.value.updated(value, undefined);
                return item;
              }
              if (item.type === ProxyType.RefO) {
                item.value.updated;
                return item;
              }
              if (item.type === ProxyType.Effect || item.type === ProxyType.Oif) {
                (item as any).value.updated();
                return item;
              }
              if (item.type === "Custom") {
                item.value(target);
                return item;
              }
            });

            target.parent = checkExistParents(target.parent);
            target["value"] = comp;
          } else {
            target["value"] = comp;
          }
        }

        return true;
      }
      return false;
    },
    deleteProperty() {
      console.error("refC - You try to delete prop in ref");
      return false;
    },
  });
}

export { refC };
