/*
  {
    [key]: proxy({ value: "", parent: []}),
    parent: []
  }
*/

import { ProxyType } from "../tsType/type";
import { ref } from "../reactive";
import error from "../error/error";
import { typeOf } from "../helper/index";

function valid(str: string) {
  return Object.keys(ProxyType).some(e => {
    return ProxyType[e] === str
  })
}

const changes = function(target, value) {
  if (target["parent"].length > 0) {
    target["parent"].forEach((e) => {
      if (e.type === "watch") {
        e.function(value, null);
      }
      if (e.type === "effect") {
        e.parent.refresh;
      }
      if (e.type === "refO") {
        e.value.changed = true;
      }
    });
  }
  return true;
}

const created = function(target, props, value, proxy) {
  const type = typeOf(value);
  if (type === "array") {
    const r = ref(value);
    r.parent.push({
      type: "refO",
      value: proxy
    });
    target[props] = r;
    return changes(target, props);
  } else if (type === "proxy") {
    if (valid(value.typeProxy)) {
      value.parent.push({
        type: "refO",
        value: proxy
      });
      target[props] = value;
      changes(target, props)
      return true;
    } else {
      error("Вы пытаетесь прокинуть не reactive orve");
      return false;
    }
  } else {
    const r = refO(value);
    r.parent.push({
      type: "refO",
      value: proxy
    });
    target[props] = r;
    changes(target, props);
    return true;
  }
}

const refO = function(object: Record<string, any>) {
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
        return changes(target, props);
      }
      if (props in target) {
        if (typeOf(target[props].value) !== typeOf(value)) {
          created(target, props, value, proxy);
        } else {
          if(typeOf(target[props]) === "proxy") {
            if (target[props].typeProxy === ProxyType.proxyObject) {
              target[props] = value;
            } else {
              target[props].value = value;
            }
          }
        }
        return changes(target, props);
      }
      if (typeof value !== "object") {
        const r = ref(value);
        r.parent.push({
          type: "refO",
          value: proxy
        });
        target[props] = r;
        return changes(target, props)
      } else {
        return created(target, props, value, proxy);
      }
    },
    deleteProperty(target, props) {
      if (props !== "parent") {
        if (props in target) {
          delete target[props];
          return changes(target, props);
        }
      }
      return false;
    }
  });

  
  Object.keys(object).forEach((e) => {
    proxy[e] = object[e];
  });
  return proxy;
}

export { refO };