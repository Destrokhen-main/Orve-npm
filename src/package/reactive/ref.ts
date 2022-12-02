
import { RefProxy, ProxyType } from "./type";
import { ONodeOrve } from "../dom/types";
import { HookObject } from "../dom/types";

enum PropsTypeRef {
  PropStatic = "PropStatic",
  PropEvent = "PropEvent",
  Child = "Child"
}

type PropRef = {
  type: PropsTypeRef,
  key: string,
  ONode: ONodeOrve
}

function updatedHook(item) {
  if (item.ONode.hooks && item.ONode.hooks.updated) {
    item.ONode.hooks.updated({
      context: { help:"use () => {}" },
      oNode: item.ONode
    } as HookObject)
  }
}

function ref(value: string | number | (() => any)) : RefProxy {
  const object = {
    value,
    parent: [],
  } as RefProxy

  return new Proxy<RefProxy>(object, {
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "typeProxy") return ProxyType.Ref;
      if (prop in target) {
        return target[prop];
      }
      return undefined;
    },
    set(target, prop, value){
      if (prop in target) {
        if (prop === "value") {
          if (target.parent.length > 0) {
            let insertValue = value;

            target.parent.forEach((item : PropRef) => {
              if (item.type === PropsTypeRef.PropStatic) {
                if (typeof insertValue === "function") {
                  insertValue = insertValue();
                }
                const node = item.ONode.node;
                if (item.key === "value") {
                  (node as HTMLInputElement).value = insertValue;
                } else {
                  node.setAttribute(item.key, insertValue);
                }
                updatedHook(item);
                return;
              }
              if (item.type === PropsTypeRef.PropEvent) {
                const node = item.ONode.node;
                node.removeEventListener(item.key, target["value"] as () => any);
                node.addEventListener(item.key, value);
              }
            });
          }
        }
        target[prop] = value;
        return true;
      }
      return false;
    },
    deleteProperty() {
      console.error("ref - You try to delete prop in ref");
      return false;
    }
  });
}

export { ref, PropRef, PropsTypeRef };