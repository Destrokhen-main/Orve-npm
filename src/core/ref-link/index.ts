import { ProxyType } from "../tsType/type";

function callParent(parents) {
  if (parents.length > 0) {
    parents.forEach((element) => {
      if (element.type === "effect") {
        element.parent.refresh;
      }
    });
  }
}

function refL() {
  const ref = new Proxy(
    {
      parent: [],
      value: null,
    },
    {
      get(target, props) {
        if (props === "type") {
          return "proxy";
        }
        if (props === "typeProxy") {
          return ProxyType.proxyElement;
        }
        if (props in target) return target[props];

        return undefined;
      },
      set(target, props, value) {
        if (props in target) {
          if (props === "value") {
            target["value"] = value;
            callParent(target.parent);
            return true;
          }
        }
      },
    },
  );
  return ref;
}

export { refL };
