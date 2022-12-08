import { ProxyType, RefLProxy, RefProxy, RefCProxy, RefOProxy } from "./type";
import e from "./error";
import { generationID } from "../usedFunction/keyGeneration";

const startWatch = (object, typeProxy, dependencies) => {
  if (!object.watch) {
    if (typeProxy === ProxyType.RefO) {
      (dependencies as RefOProxy).$parent.push({
        type: ProxyType.Watch,
        value: object,
      });
    } else {
      (dependencies as any).parent.push({
        type: ProxyType.Watch,
        value: object,
      });
    }
    object.watch = true;
  }
};

function watch(
  func: () => void,
  dependencies: RefLProxy | RefProxy | RefCProxy | RefOProxy = null,
) {
  const object = {
    key: generationID(8),
    parent: dependencies,
    watch: false,
    value: func,
    updated: function (n: any, o: any) {
      this.value(n, o);
    },
  };

  if (dependencies === null) {
    console.warn("Watch - dependencies in null, return empty object");
    return null;
  }

  if (
    typeof dependencies !== "object" ||
    dependencies.type !== ProxyType.Proxy
  ) {
    e(
      " Watch - dependencies need to be orve reactive object (ref, refL, refC)",
    );
  }

  const typeProxy = dependencies.proxyType;

  if (typeProxy === ProxyType.RefO) {
    (dependencies as RefOProxy).$parent.push({
      type: ProxyType.Watch,
      value: object,
    });
  } else {
    (dependencies as any).parent.push({
      type: ProxyType.Watch,
      value: object,
    });
  }
  //startWatch();

  const n =  new Proxy(object, {
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.Watch;
      if (prop in target) {
        return target[prop];
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
    },
  });

  n["stop"] = () => {
    if (object.watch) {
      (dependencies as any).parent = (dependencies as any).parent.filter(
        (i: any) => i.key !== undefined && i.key === object.key,
      );
      object.watch = false;
    }
  };

  n["start"] = () => startWatch(object, typeProxy, dependencies);

  return n;
}

export { watch };
