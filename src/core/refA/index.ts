// return object.map((e: number | string | object) => {
//   const type = typeOf(e);
//   if (type !== "function" && type !== "proxy") {
//     return ref(e);
//   } else {
//     return e;
//   }
// })
import { ProxyType } from "../tsType/type";

const cOrr = ['push', 'pop', 'shift', 'unshift', 'splice'];
function createArrayProxy(ar) {
  const handler = {};
  cOrr.forEach((key) => {
    handler[key] = function() {
      const args = [];
      for(let i = 0; i !== arguments.length; i++ ) {
        args.push(arguments[i]);
      }
      Array.prototype[key].apply(this, args);
      ar.forEach(e => {
        e.parent.refresh;
      })
    }
  })
  return handler;
}

const valueCreator = function(obj) {
  const parent = this.parent;
  const arPr = createArrayProxy(parent);
  return new Proxy(obj, {
    get(target, props, receive) {
      if (arPr[props] !== undefined) {
        return Reflect.get({
          target,
          ...arPr
        }, props, receive);
      }

      return target[props];
    }
  })
}

const refA = function(obj: Array<any>) {
  const proxy = {
    parent: [],
    value: valueCreator,
    type: "proxy",
    typeProxy: ProxyType.proxyArray,
  };
  proxy.value = proxy.value(obj);
  return proxy;
}

export {
  refA
}