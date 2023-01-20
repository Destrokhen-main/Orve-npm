// TODO [ ] - isProxy with null 

import { ProxyType } from "../reactive/type";

const isProxy = function (obj: any) {
  if (typeof obj === null || typeof obj === undefined) return false;
  return obj.type === ProxyType.Proxy ? true : false;
};

export const typeOf = function (obj: any) {
  const type : string = typeof obj;
  console.log(type);
  if (type === "null") return "null";
  if (type === "undefined") return "undefined";

  if (type === "object") {
    console.log(type);
    if (isProxy(obj)) {
      return ProxyType.Proxy;
    } else if (Array.isArray(obj)) {
      return "array";
    }
    return "object";
  }
  return type;
};
