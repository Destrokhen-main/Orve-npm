import { ProxyType } from "../tsType/type";
import { typeOf } from "../helper/index";
import { refO } from "../refO";
import { refA } from "../refA";

export const ref = function (object: any) {
  const type = typeOf(object);
  if (type === "object") {
    console.warn(
      `Вы пытались записать в ref объект.\nОбъект был перенаправлен в refO`,
    );
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
              }
            }
            if (el.type === "props") {
              if (el.key === "value") {
                el.value.value = value;
              } else if (value === "") {
                el.value.removeAttribute(el.key);
              } else {
                el.value.el.setAttribute(el.key, value);
              }
            }
            if (el.type === "watch") {
              el.function(value, before);
            }
            if (el.type === "effect") {
              el.parent.refresh;
            }
            if (el.type === "refO") {
              el.value.changed = true;
            }
          });
        }
        return true;
      } else {
        return false;
      }
    },
    deleteProperty(target, props) {
      return false;
    },
  });
};
