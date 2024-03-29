import { RefProxy, ProxyType, PropsStartType, RefOProxy, UtilsRef } from "./type";
import { ONode } from "../dom/types";
import { HookObject } from "../dom/types";
import { HookObjectType } from "../dom/types";
import { typeOf } from "../usedFunction/typeOf";
import { refO } from "../reactive/refO";
import { refA } from "./refA";
import { Orve } from "../default";
import { formatedRef } from "../dom/mount/child";

enum PropsTypeRef {
  PropStatic = "PropStatic",
  PropEvent = "PropEvent",
  Child = "Child",
  Custom = "Custom",
  EffectStyle = "EffectStyle",
  EffectImg = "EffectImg",
  EffectChild = "EffectChild"
}

interface PropRef {
  type: PropsTypeRef | ProxyType;
  key: string;
  ONode: ONode;
  formate?: () => string | number | (() => string | number)
};

interface ChildRef {
  type: PropsTypeRef | ProxyType;
  node: HTMLElement | Text | ChildNode;
  ONode: ONode;
  formate?: () => any 
};

// function retTypeRef(value: string | number | (() => any)): PropsStartType  {
//   const tValue = typeof value;
//   if (tValue === "string" || tValue === "number") {
//     return PropsStartType.Static;
//   } else if (tValue === "function") {
//     return PropsStartType.Function;
//   }
// }

function updatedHook(item: any, type: HookObjectType) {
  if (item.ONode.hooks && item.ONode.hooks.updated) {
    item.ONode.hooks.updated({
      context: Orve.context,
      oNode: item.ONode,
      type,
    } as HookObject);
  }
}

function checkExistParents(ar: Array<PropRef>): Array<PropRef> {
  const nArr: Array<PropRef> = [];

  ar.forEach((e: PropRef) => {
    if (!(e.type in PropsTypeRef) || e.type === "Custom") {
      nArr.push(e);
      return;
    }
    if (document.body.contains(e.ONode.node)) nArr.push(e);
  });

  return nArr;
}

function ref(value: string | number | (() => any) | any[]): RefProxy | RefOProxy | any {
  if (typeOf(value) === "object") {
    return refO(value);
  }

  if (Array.isArray(value)) {
    return refA(value as any[]);
  }

  const object: RefProxy= {
    value,
    parent: [],
    startType: PropsStartType.None,
    type: ProxyType.Proxy,
    proxyType: ProxyType.Ref,
    formate: function(func) {
      if (typeof func !== "function") {
        return this;
      }
      return {
        type: UtilsRef.Format,
        proxy: this,
        formate: func,
        value: function() {
          return this.formate(this.value);
        }
      }
    }
  };

  return new Proxy<RefProxy>(object, {
    get(target: RefProxy, prop: keyof RefProxy | string) {
      if (prop in target) {
        return target[prop as keyof RefProxy];
      }
      return undefined;
    },
    set(target, prop, value) {
      if (prop in target) {
        if (prop === "value") {
          if (target.parent.length > 0) {
            let insertValue = value;
            const lastValue = target[prop];
            target[prop] = value;

            target.parent.forEach((item: PropRef | ChildRef) => {
              if (item.type === PropsTypeRef.PropStatic) {
                const node = item.ONode.node;

                insertValue = formatedRef(item, value);

                if (typeof insertValue === "function") {
                  insertValue = insertValue();
                }

                if ((item as PropRef).key === "value") {
                  (node as HTMLInputElement).value = insertValue;
                } else {
                  (node as HTMLElement).setAttribute(
                    (item as PropRef).key,
                    insertValue,
                  );
                }
                updatedHook(item, HookObjectType.Props);
                return;
              }
              if (item.type === PropsTypeRef.PropEvent) {
                const node: HTMLElement = item.ONode.node as HTMLElement;
                const key = (item as PropRef).key;
                const insertValue = formatedRef(item, value);
                if (typeof insertValue !== "function") {
                  console.error("insert not a function in eventlister");
                } else {
                  if (String((item as any).lastCall) !== String(insertValue)) {
                    node.removeEventListener(
                      key,
                      (item as any).lastCall,
                    );
                    node.addEventListener(key, insertValue);
                    updatedHook(item, HookObjectType.Props);
                    (item as any).lastCall = insertValue
                  }
                }
                return;
              }
              if (item.type === PropsTypeRef.Child) {
                const childRef = item as ChildRef;
                if (childRef.node.nodeType === 3) {
                  const text = formatedRef(childRef, value);
                  childRef.node.nodeValue = text;
                  updatedHook(item, HookObjectType.Child);
                }
                return;
              }
              if (item.type === ProxyType.Watch) {
                (item as any).value.updated(value, lastValue);
                return;
              }
              if (item.type === ProxyType.RefO) {
                (item as any).value.updated;
                return;
              }
              if (item.type === ProxyType.Effect || item.type === ProxyType.Oif) {
                (item as any).value.updated();
              }
              if (item.type === "Custom") {
                (item as any).value(target);
              }
            });
            target.parent = checkExistParents(target.parent);
          } else {
            target[prop] = value;
          }
        }
        return true;
      }
      return false;
    },
    deleteProperty() {
      console.error("ref - You try to delete prop in ref");
      return false;
    },
  });
}

export { ref, PropRef, PropsTypeRef, ChildRef };
