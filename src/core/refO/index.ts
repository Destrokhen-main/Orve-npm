/*
  {
    [key]: proxy({ value: "", parent: []}),
    parent: []
  }
*/

import { ProxyType } from "../tsType/type";
import { ref } from "../reactive";
import error from "../error/error";

function valid(str: string) {
  return Object.keys(ProxyType).some(e => {
    return ProxyType[e] === str
  })
}

const refO = function(object: Generator<string, any>) {
  const pr = {
    parent: [],
  };

  const proxy = new Proxy(pr, {
    get(target, props) {
      if (props === "type") return "proxy";
      if (props === "typeProxy") return ProxyType.proxyObject;

      return target[props];
    },
    set(target, props, value) {
      if (props === "changed") {
        if (target["parent"].length > 0) {
          target["parent"].forEach((e) => {
            if (e.type === "watch") {
              e.function(value, null);
            }
            if (e.type === "effect") {
              e.parent.refresh;
            }
          });
        }
        return true;
      }
      if (typeof value !== "object") {
        const r = ref(value);
        r.parent.push({
          type: "refO",
          value: proxy
        });
        target[props] = r;
        return true;
      } else {
        if(Array.isArray(value)) {
          const r = ref(value);
          r.parent.push({
            type: "refO",
            value: proxy
          });
          target[props] = r;
          return true;
        } else if (value.type === "proxy") {
          if (valid(value.typeProxy)) {
            value.parent.push({
              type: "refO",
              value: proxy
            });
            target[props] = value;
            return true;
          } else {
            error("Вы пытаетесь прокинуть proxy не orve");
            return false;
          }
        }
      }
      target[props] = value;
      return true;
    }
  });

  Object.keys(object).forEach((e) => {
    proxy[e] = object[e];
  });
  return proxy;
}

export { refO };