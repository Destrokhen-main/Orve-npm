
import { ProxyType } from "./type";
import e from "./error";

function watch(func: () => void, dependencies: any = null) {
  const object = {
    value: func,
    updated: function(n: any, o: any) { this.value(n, o) }
  }

  if (dependencies === null) {
    console.warn("Watch - dependencies in null, return empty object");
    return null
  }

  if (typeof dependencies !== "object" || dependencies.type !== ProxyType.Proxy) {
    e(" Watch - dependencies need to be orve reactive object (ref, refL, refC)");
  }

  dependencies.parent.push({
    type: ProxyType.Watch,
    value: object
  });

  return new Proxy(object, {
    get(target, prop) {
      if(prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.Watch;
      if (prop in target) {
        return target[prop]
      }
      return undefined;
    },
    set(target, prop, value) {
      if (prop in target) {
        target[prop] = value;
      }
      return true;
    },
    deleteProperty() {
      console.error("Watch - You try to delete prop in ref");
      return false;
    }
  });
}

export {
  watch
}