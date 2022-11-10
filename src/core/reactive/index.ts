import { ProxyType } from "../tsType/type";
import { typeOf } from "../helper/index";

export const ref = function(object : any, array : boolean = false) {
  const p = {
    parent: [],
    value: object,
  }

  if (typeOf(object) === "object" && !array) {
    console.warn(`в ref object.\n Для таких случаев, лучше использовать refO`);
    return;
  }

  if (typeOf(object) === "array") {
    return object.map((e: number | string | object) => {
      const type = typeOf(e);
      if (type !== "object" && type !== "proxy" && type !== "array")
        return ref(e, true);
      else if (type === "proxy") {
        // TODO проверка на тип прокси
        // if (e.typeProxy)
      } else if (type === "array") {
        // array
      } else {
        // object
        return "not value";
      }
    })
  }

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
              if (value === "") {
                el.value.removeAttribute(el.key);
              } else {
                el.value.setAttribute(el.key, value);
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
    deleteProperty(target,props) {
      return false;
    }
  })
}
