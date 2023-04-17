import er, { message as m } from "./error";
import { typeOf } from "../../usedFunction/typeOf";

const KEYS = ["tag", "props", "child", "hooks", "key", "ref", "html"];

function isONode(node: Record<string, any>) {
  if (!node["tag"]) {
    er(m.MISSING_TAG);
  }

  Object.keys(node).forEach((key) => {
    if (!KEYS.includes(key.toLowerCase())) {
      er(`${String(node).substring(0, 50)}... "${key}" - ${m.UNSUPPORTED_KEY_IN_OBJECT}`);
    }
  });

  if (node["props"] && typeOf(node["props"]) !== "object") {
    er(`${String(node).substring(0, 50)}... ${node["props"]} - ${m.PROPS_NOT_A_NEED_TYPE}`);
  }

  return true;
}

function isNodeBoolean(node: Record<string, any>) {
  if (!node["tag"]) {
    return false;
  }

  if (node["props"] && typeOf(node["props"]) !== "object") {
    return false;
  }

  let checker = true;
  Object.keys(node).forEach((key) => {
    if (!KEYS.includes(key.toLowerCase())) {
      checker = false;
    }
  });

  return checker;
}

export { isONode, isNodeBoolean };
