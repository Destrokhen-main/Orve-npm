import er, { message as m } from "./error";
import { typeOf } from "../../usedFunction/typeOf";

const keys = ["tag", "props", "child", "hooks", "key", "ref"];

function isONode(workObj: object) {
  Object.keys(workObj).forEach((key) => {
    if (!keys.includes(key.toLowerCase())) {
      er(`"${key}" - ${m.UNSUPPORTED_KEY_IN_OBJECT}`);
    }
  });

  if (!workObj["tag"]) {
    er(m.MISSING_TAG);
  }

  if (workObj["props"] && typeOf(workObj["props"]) !== "object") {
    er(`${workObj["props"]} - ${m.PROPS_NOT_A_NEED_TYPE}`);
  }

  return true;
}

function isNodeBoolean(workObj: object) {
  let checker = true;
  Object.keys(workObj).forEach((key) => {
    if (!keys.includes(key.toLowerCase())) {
      checker = false;
    }
  });

  if (!workObj["tag"]) {
    return false;
  }

  if (workObj["props"] && typeOf(workObj["props"]) !== "object") {
    return false;
  }
  return checker;
}

export { isONode, isNodeBoolean };
