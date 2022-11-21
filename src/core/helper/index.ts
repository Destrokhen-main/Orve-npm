const isProxy = function (obj: any) {
  return obj.type === "proxy" ? true : false;
};

const typeOf = function (obj: any) {
  const type = typeof obj;
  if (type === "object") {
    if (isProxy(obj)) {
      return "proxy";
    } else if (Array.isArray(obj)) {
      return "array";
    }
    return "object";
  }
  return type;
};

const createObjectContext = function (app: object): object {
  const Context = {};
  Object.keys(app).forEach((e) => {
    Object.keys(app[e]).forEach((l) => {
      if (l.startsWith("$")) Context[l] = app[e][l];
      else Context[`$${l}`] = app[e][l];
    });
  });
  return Context;
};

const objectToArray = function (child: any): Array<any> {
  if (!Array.isArray(child)) {
    return [child];
  }
  return child;
};

function isEqualArray(ar1, ar2) {
  if (ar1.length !== ar2.length) return false;

  for (let i = 0; i < ar1.length; i++) {
    const tp1 = typeOf(ar1[i]);
    const tp2 = typeOf(ar2[i]);
    if (tp1 !== tp2) return false;
    if (tp1 === "object" && !isEqual(ar1[i], ar2[i])) {
      return false;
    } else if (tp1 === "array" && !isEqualArray(ar1[i], ar2[i])) {
      return false;
    } else if (ar1[i] !== ar2[i]) {
      return false;
    }
  }

  return true;
}

function isEqual(object1, object2) {
  const props1 = Object.getOwnPropertyNames(object1);
  const props2 = Object.getOwnPropertyNames(object2);
  if (props1.length !== props2.length) {
    return false;
  }

  for (let i = 0; i < props1.length; i++) {
    if (props1[i] === "node") continue;
    const p = props1[i];
    const tp1 = typeOf(object1[p]);
    const tp2 = typeOf(object2[p]);
    if (tp1 !== tp2) return false;

    if (tp1 === "object" && !isEqual(object1[p], object2[p])) {
      return false;
    } else if (tp1 === "array" && !isEqualArray(object1[p], object2[p])) {
      return false;
    } else if (object1[p] !== object2[p]) {
      return false;
    }
  }

  return true;
}

export { isProxy, typeOf, createObjectContext, objectToArray, isEqual };
