import { RefOProxy } from "./type";
import { ref } from "./ref";
import { typeOf } from "../usedFunction/typeOf";
import { ProxyType } from "../reactive/type";
import { refA } from "./refA";

import { parseChildren } from "../dom/builder/children";
import { childF } from "../dom/mount/child";
import { Node } from "../jsx";

export enum refOT {
  refO = "refO"
}

//import { ReactiveParams } from "./type";

function updated(target: Record<string, any>) {
  if (target.$parent.length > 0) {
    target.$parent.forEach((item: any) => {
      if (item.type === ProxyType.Watch) {
        const i = Object.assign({}, target);
        delete i["$parent"];
        item.value.updated(i, undefined);
      }
      if (item.type === ProxyType.RefO) {
        item.value.updated;
      }
      if (item.type === ProxyType.Effect || item.type === ProxyType.Oif) {
        (item as any).value.updated();
      }
      if (item.type === "Custom") {
        item.value(target);
        return;
      }
    });
  }
}

function createReactiveObjectByProp(prop: string, value: any, mainProxy: RefOProxy) {
  const type = typeOf(value);
  if (type === "string" || type === "number" || type === "boolean") {
    const r = ref(value);
    (r as any).parent.push({
      type: ProxyType.RefO,
      value: mainProxy,
    });
    return r;
  }

  if (type === "array") {
    const arr = refA(value);
    arr.parent.push({
      type: ProxyType.RefO,
      value: mainProxy
    });
    return arr;
  } 

  if (type === "object") {
    const rO = refO(value);
    rO.$parent.push({
      type: ProxyType.RefO,
      value: mainProxy,
    });
    return rO;
  }

  if (type === "Proxy") {
    return type;
  }
}

function refO(object: any) {
  const obj : RefOProxy = {
    $parent: [],
    $reactiveParams: [],
    $undKey: {}
  };

  const mainProxy: any = new Proxy<RefOProxy>(obj, {
    get(target: Record<string, any>, prop: string) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.RefO;
      if (prop === "updated") {
        updated(target);
      }
      if (prop in target) {
        return target[prop];
      }
      if (!(prop in target) && target.$undKey[prop] === undefined) {
        target.$undKey[prop] = null;

        return {
          type: refOT.refO,
          prop,
          proxy: mainProxy,
        }
      }
      return undefined;
    },
    set(target: Record<string, any>, prop: string, value: any) {
      if (!(prop in target)) {
        // TODO при присвоение, может потерять $parent
        // const indexEmtyObject = target.$reactiveParams.findIndex((e: ReactiveParams) => e.nameValue === prop);

        if (target.$undKey[prop] !== undefined) {
          const item = target.$undKey[prop];
          const v = ref(value);

          const i = parseChildren([ Node("div", {}, v) as any ], null, item.ONode, true);

          if (i[0] === undefined) {
            return false;
          }
          
          const [ mountedItem ] = childF(null, i);

          if (mountedItem === undefined) return false;

          target[prop] = mountedItem.child[0].value;
        
          item.node.replaceWith(mountedItem.child[0].node);

          delete target.$undKey[prop];          
          return true;
        }

        const v = createReactiveObjectByProp(prop, value, mainProxy);
        if (v === "Proxy") {
          value.parent.push({
            type: ProxyType.RefO,
            value: mainProxy,
          });
          target[prop] = value;
          return true;
        } else {
          target[prop] = v;
          updated(target);
          return true;
        }
      } else {
        if (!["$parent", "$type", "$proxyType", "$undKey"].includes(prop)) {
          target[prop].value = value;
          return true;
        }
      }
      return false;
    },
    deleteProperty(target: Record<string, any>, prop: string) {
      if (!["$parent", "$type", "$proxyType"].includes(prop)) {
        delete target[prop];
        return true;
      } else {
        console.error("refO - You try to delete [$parent | $type | $proxyType] prop in refO");
        return false;
      }
    },
  });

  Object.keys(object).forEach((key: string) => {
    (mainProxy as any)[key] = object[key];
  });

  return mainProxy;
}

export { refO };
