import { ProxyType, RefOProxy } from "./type";
import e from "./error";
import { generationID } from "../usedFunction/keyGeneration";
import { Proxy } from "./type";

const startWatch = (object: Watch, typeProxy: ProxyType, dependencies: any) => {
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

interface Watch extends Proxy {
  key: string;
  parent: any[];
  watch: boolean;
  value: (n: any, o: any) => void;
  updated: (n: any, o: any) => void;
}

function watch(func: () => void, dependencies: any = null) {
  const object: Watch = {
    key: generationID(8),
    parent: dependencies,
    watch: false,
    value: func,
    updated: function (n: any, o: any) {
      this.value(n, o);
    },
    type: ProxyType.Proxy,
    proxyType: ProxyType.Watch,
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

  const n = new Proxy(object, {
    get(target: Watch, prop: keyof Watch | string) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.Watch;
      if (prop in target) {
        return target[prop as keyof Watch];
      }
      return undefined;
    },
    set(target: Watch | any, prop: keyof Watch | string, value: any) {
      if (prop in target) {
        target[prop as keyof Watch] = value;
        return true;
      } else {
        return false;
      }
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
