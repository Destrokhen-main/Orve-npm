import { typeOf } from "../helper/index";
import error from "../error/error";
import errorMessage from "../error/errorMessage";
import { Node } from "../tsType/index";

const SUPPORTED_CHILD_RESULT = ["string", "object", "array"];

const validateChildFunction = function(res: any, index: number) {
  const typeResult = typeOf(res);
  if (!SUPPORTED_CHILD_RESULT.includes(typeResult)) error(`${res} | номер в массиве: ${index} - ${errorMessage.unsupportedTagC}`);
  return typeResult;
}

const SUPPORTED_TYPE_CHILDREN = ["function", "string", "proxy", "object", "number"];
const validatorChild = function(childs: Node[]) {
  childs = childs.flat(1);
  
  if (typeOf(childs) !== "array") {
    error(`${childs} - ${errorMessage.childNotArray}`);
  }

  if (childs.length > 0) {
    childs.forEach((child) => { 
      if (!SUPPORTED_TYPE_CHILDREN.includes(typeOf(child))) {
        error(`${typeOf(child)} - ${errorMessage.unsupportedTagC}`);
      }
    });
  }
}

export {
  validateChildFunction,
  validatorChild
}