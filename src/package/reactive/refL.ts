
import { ProxyType, RefLProxy } from "./type";

function refL() : RefLProxy {
  const object = {
    parent: [],
    value: null,
  } as RefLProxy;

  return new Proxy<RefLProxy>(object, {
    set(target, prop, value) {
      if (prop in target) {
        if (prop === "value") {
          target["value"] = value;

          // call all parents
          return true;
        }
      }
      return false;
    },
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.RefL;
      if (prop in target) {
        return target[prop];
      }
      return undefined;
    },
    deleteProperty() {
      console.error(`refL - you try to delete prop in refL`);
      return false;
    } 
  });
}

export { refL }