import { ProxyType, RefCProxy } from "./type";
import { ChildType } from "../dom/builder/children";
import { parser } from "../dom/builder/index";
import { mountedNode } from "../dom/mount/index";
import { HookObject } from "../dom/types";
import { HookObjectType } from "../dom/types";
import { isEqual } from "../usedFunction/isEqual";

function updatedHook(item: any, type: HookObjectType) {
  if (item.hooks && item.hooks.updated) {
    item.hooks.updated({
      context: window.orve.context,
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
          if (target.parent.length > 0) {
            let comp = value;
            if (comp === undefined || comp === "" || comp === null) {
              comp = () => ({ tag: "comment", child: "refC" });
            }
            if (typeof comp !== "function") {
              comp = () => comp;
            }
            target.parent = target.parent.map((item) => {
              if (item.type === ChildType.ReactiveComponent) {
                const parsedItem = parser.call(
                  window.orve.context,
                  comp,
                  item.ONode.parent.props,
                  item.ONode.parent,
                );
                const element = mountedNode.call(
                  window.orve.context,
                  null,
                  parsedItem,
                );
                if (!isEqual(element, item.ONode)) {
                  item.ONode.node.replaceWith(element.node);
                  item.ONode = element;
                  updatedHook(item.ONode.parent, HookObjectType.Component);
                }
                return item;
              }
              if (item.type === ProxyType.Watch) {
                item.value.updated(value, undefined);
                return item;
              }
              if (item.type === ProxyType.RefO) {
                item.value.updated;
                return item;
              }
            });

            target.parent = checkExistParents(target.parent);
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
