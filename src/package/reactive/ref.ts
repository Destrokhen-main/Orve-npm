
import { RefProxy, ProxyType, PropsStartType } from "./type";
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

function retTypeRef(value: string | number | (() => any)): PropsStartType  {
  const tValue = typeof value;
  if (tValue === "string" || tValue === "number") {
    return PropsStartType.Static;
  } else if (tValue === "function") {
    return PropsStartType.Function;
  }
}

function updatedHook(item) {
  if (item.ONode.hooks && item.ONode.hooks.updated) {
    item.ONode.hooks.updated({
      context: window.orve.context,
      oNode: item.ONode
    } as HookObject)
  }
}

function checkExistParents(ar: Array<PropRef>) : Array<PropRef> {
  const nArr : Array<PropRef> = [];

  ar.forEach((e : PropRef) => {
    if (document.body.contains(e.ONode.node))
      nArr.push(e);
  })

  return nArr;
}

function ref(value: string | number | (() => any)) : RefProxy {
  const object = {
    value,
    parent: [],
    startType: PropsStartType.None
  } as RefProxy

  return new Proxy<RefProxy>(object, {
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.Ref;
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
                const node = item.ONode.node;

                if (typeof insertValue === "function") {
                  insertValue = insertValue();
                }

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
                if (typeof value !== "function") {
                  console.error("insert not a function in eventlister");
                } else {
                  node.addEventListener(item.key, value);
                }
              }
            });
            target.parent = checkExistParents(target.parent);
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