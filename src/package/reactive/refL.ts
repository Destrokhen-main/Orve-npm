import { ProxyType, RefLProxy } from "./type";

function refL(): RefLProxy {
  const object: RefLProxy = {
    parent: [],
    value: null,
    type: ProxyType.Proxy,
    proxyType: ProxyType.RefL,
  };

  return new Proxy<RefLProxy>(object, {
    set(target, prop, value) {
      if (prop in target) {
        if (prop === "value") {
          if (target.parent.length > 0) {
            target.parent.forEach((item) => {
              if (item.type === ProxyType.Watch) {
                item.value.updated(value, target.value);
                return;
              }
              if (item.type === ProxyType.RefO) {
                item.value.updated;
                return;
              }
              if (item.type === "Custom") {
                item.value(target);
                return;
              }
            });
          }
          target["value"] = value;
          return true;
        }
      }
      return false;
    },
    get(target: RefLProxy, prop: keyof RefLProxy) {
      if (prop in target) {
        return target[prop];
      }
      return undefined;
    },
    deleteProperty() {
      console.error(`refL - you try to delete prop in refL`);
      return false;
    },
  });
}

export { refL };
