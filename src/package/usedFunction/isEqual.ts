import { typeOf } from "./typeOf";

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
    if (
      props1[i] === "node" ||
      props1[i] === "keyNode" ||
      props1[i] === "parent" ||
      props2[i] === "node" ||
      props2[i] === "keyNode" ||
      props2[i] === "parent"
    )
      continue;
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

export { isEqual };
