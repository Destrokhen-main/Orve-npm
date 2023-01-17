import { ProxyType } from "../reactive/type";

const isProxy = function (obj: any) {
  return obj.type === ProxyType.Proxy ? true : false;
};

export const typeOf = function (obj: any) {
  const type = typeof obj;
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
