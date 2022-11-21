import { ProxyType } from "../tsType/type";

import { builder } from "../builder/index";
import { createNode } from "../mount/createNode";

export const refC = function (component: any) {
  const object = {
    parent: [],
    value: component,
  };

  return new Proxy(object, {
    get(target, prop) {
      if (prop === "type") {
        return "proxy";
      }
      if (prop === "typeProxy") {
        return ProxyType.proxyComponent;
      }
      if (prop in target) {
        return target[prop];
      }
    },
    set(target, prop, value) {
      if (prop in target) {
        if (prop === "value") {
          if (target.parent.length > 0) {
            const newObj = builder.bind(window.sReact.sReactContext)(value);
            const object = createNode(null, newObj);
            target.parent = target.parent.map((el) => {
              if (el.type === undefined) {
                el.node.replaceWith(object);
                if (el.value.hooks?.unmounted) {
                  el.value.hooks.unmounted();
                }
                return {
                  node: object,
                  value: newObj,
                };
              } else if (el.type === "effect") {
                el.parent.refresh;
                return el;
              }
            });
          }
        }
        target[prop] = value;
        return true;
      }
      return false;
    },
    deleteProperty() {
      return false;
    },
  });
};
