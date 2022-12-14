// return object.map((e: number | string | object) => {
//   const type = typeOf(e);
//   if (type !== "function" && type !== "proxy") {
//     return ref(e);
//   } else {
//     return e;
//   }
// })
import { ProxyType } from "../tsType/type";

// function isNumber(number: any) {
//   return (
//     typeof number === "string" &&
//     number !== "NaN" &&
//     number[0] !== "-" &&
//     "" + parseInt(number) === number
//   );
// }

const cOrr = ["push", "pop", "shift", "unshift", "splice"];
function createArrayProxy(ar) {
  const handler = {};
  cOrr.forEach((key) => {
    handler[key] = function (...args) {
      Array.prototype[key].apply(this, args);
      ar.forEach((e) => {
        e.parent.refresh;
      });
    };
  });
  return handler;
}

const valueCreator = function (obj) {
  const arPr = createArrayProxy(this.parent);
  //const parent = this.parent;
  return new Proxy(obj, {
    get(target, props, receive) {
      if (arPr[props] !== undefined) {
        return Reflect.get(
          {
            target,
            ...arPr,
          },
          props,
          receive,
        );
      }

      return target[props];
    },
  });
};

const refA = function (obj: Array<any>) {
  const proxy = {
    parent: [],
    value: valueCreator,
    type: "proxy",
    typeProxy: ProxyType.proxyArray,
  };
  proxy.value = proxy.value(obj);
  return proxy;
};

export { refA };
