import { ProxyType } from "../reactive/type";

const isProxy = function (obj: any) {
  return obj.type === ProxyType.Proxy ? true : false;
};

export const typeOf = function (obj: any) {
  const type : string = typeof obj;
  if (obj === null) return "null";
  if (obj === undefined) return "undefined";

  if (type === "object") {
    if (isProxy(obj)) {
      return ProxyType.Proxy;
    } else if (Array.isArray(obj)) {
      return "array";
    }
    return "object";
  }
  return type;
};
