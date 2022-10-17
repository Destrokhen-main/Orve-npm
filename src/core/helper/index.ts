const isProxy = function(obj: any) {
  return obj.type === "proxy" ? true : false; 
}

const typeOf = function(obj: any) {
  const type = typeof obj;
  if (type === "object") {
    if (isProxy(obj)) {
      return "proxy";
    } else if (Array.isArray(obj)) {
      return "array";
    }
    return "object"
  }
  return type;
}

export {
  isProxy,
  typeOf,
}