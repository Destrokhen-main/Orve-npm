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

const createObjectContext = function(app: object) : object {
  const Context = {};
  Object.keys(app).forEach((e) => {
    Object.keys(app[e]).forEach((l) => {
      if (l.startsWith("$"))
        Context[l] = app[e][l];
      else
        Context[`$${l}`] = app[e][l];
    })
  });
  return Context;
}

export {
  isProxy,
  typeOf,
  createObjectContext
}