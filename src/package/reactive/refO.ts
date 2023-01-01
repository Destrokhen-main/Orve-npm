import { RefOProxy } from "./type";
import { ref } from "./ref";
import { typeOf } from "../usedFunction/typeOf";
import { ProxyType } from "../reactive/type";

function refO(object: any) {
  const obj = {
    $parent: [],
  } as RefOProxy;

  const mainProxy = new Proxy<RefOProxy>(obj, {
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.RefO;
      if (prop === "updated") {
        if (target.$parent.length > 0) {
          target.$parent.forEach((item) => {
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
      if (prop in target) {
        return target[prop];
      }
      return undefined;
    },
    set(target, prop, value) {
      if (!(prop in target)) {
        const type = typeOf(value);
        if (type === "string" || type === "number") {
          const r = ref(value);
          (r as any).parent.push({
            type: ProxyType.RefO,
            value: mainProxy,
          });
          target[prop] = r;
          return true;
        }
        if (type === "object") {
          const rO = refO(value);
          rO.$parent.push({
            type: ProxyType.RefO,
            value: mainProxy,
          });
          target[prop] = rO;
          return true;
        }
        if (type === "Proxy") {
          value.parent.push({
            type: ProxyType.RefO,
            value: mainProxy,
          });
          target[prop] = value;
          return true;
        }
      }
      return false;
    },
    deleteProperty(target, prop) {
      if (prop !== "$parent") {
        delete target[prop];
        return true;
      } else {
        console.error("refO - You try to delete $parent prop in refO");
        return false;
      }
    },
  });

  Object.keys(object).forEach((key) => {
    mainProxy[key] = object[key];
  });

  return mainProxy;
}

export { refO };
