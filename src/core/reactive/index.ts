import { ProxyType } from "../tsType/type";
import { typeOf } from "../helper/index";
import { refO } from "../refO";
import { refA } from "../refA";

function updated(el) {
  if (Array.isArray(el.node) && el.node.length > 0) {
    el.node.forEach((e) => {
      if (
        e.node["hooks"] !== undefined &&
        e.node["hooks"]["updated"] !== undefined
      ) {
        e.node["hooks"]["updated"]({ ...window.sReact.sReactContext, ...e });
      }
    });
    return;
  }

  if (
    el.node["hooks"] !== undefined &&
    el.node["hooks"]["updated"] !== undefined
  ) {
    el.node["hooks"]["updated"]({ ...window.sReact.sReactContext, ...el });
  }
}

export const ref = function (object: any) {
  const type = typeOf(object);
  if (type === "object") {
    // console.warn(
    //   `Вы пытались записать в ref объект.\nОбъект был перенаправлен в refO`,
    // );
    return refO(object);
  }

  if (type === "array") {
    return refA(object);
  }

  const p = {
    parent: [],
    value: object,
  };

  return new Proxy(p, {
    get(target, prop) {
      if (prop === "type") return "proxy";
      if (prop === "typeProxy") return ProxyType.proxySimple;
      if (prop in target) {
        return target[prop];
      } else {
        return undefined;
      }
    },
    set(target, prop, value) {
      if (prop in target) {
        if (prop === "value") {
          const parents = target.parent;
          const before = target[prop];
          target[prop] = value;
          parents.forEach((el) => {
            if (el.type === "child") {
              if (el.value.nodeType === 3) {
                el.value.nodeValue = value;
                updated(el);
              }
            }
            if (el.type === "props") {
              if (el.key === "value") {
                el.value.value = value;
              } else if (value === "") {
                el.value.removeAttribute(el.key);
              } else {
                el.value.setAttribute(el.key, value);
              }
              updated(el);
            }
            if (el.type === "watch") {
              el.function(value, before);
            }
            if (el.type === "effect") {
              el.parent.refresh;
              updated(el);
            }
            if (el.type === "refO") {
              el.value.changed = true;
              updated(el);
            }
          });
        }
        return true;
      } else {
        return false;
      }
    },
    deleteProperty() {
      return false;
    },
  });
};
