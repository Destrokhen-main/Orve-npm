import { typeOf } from "../helper/index";

import error from "../error/error";
import errorMessage from "../error/errorMessage";

import { validatorProps, validSingleProps } from "./props";
import { validateChildFunction, validatorChild } from "./child";
import { Node } from "../tsType/index";
import { ProxyType } from "../tsType/type";


const SUPPORTED_VARIABLES = ["tag", "props", "child", "key", "ref"];
const validatorMainNode = function(node: Node) {
  // check unsupported object variables
  Object.keys(node).forEach((key) => {
    if (!SUPPORTED_VARIABLES.includes(key)) {
      error(`${key} - ${errorMessage.useUnsupportedVariables}`);
    }
  });
  const { tag, props, child, ref} = node;

  // check exist tag
  if(tag === undefined) {
    error(errorMessage.missTagOnObject);
  }
  if(props !== undefined) {
    validatorProps(props);
  }
  if(child !== undefined) {
    if (Array.isArray(child)) {
      validatorChild(child);
    } else {
      error(`Child может быть только типа array`);
    }
  }
  if (ref !== undefined) {
    if (typeOf(ref) === "proxy") {
      const typeProxy = ref.typeProxy;
      if (typeProxy !== ProxyType.proxyElement) {
        error("ref может хранить в себе только refL")
      }
    } else {
      error("ref может хранить только proxy orve")
    }
  }
}

const CORRECT_ANSWER = ["array", "string", "object", "number", "proxy"];
const validateFunctionAnswer = function(res, index) {
  if (res === undefined) {
    error(`${res} | номер в массиве: ${index} - ${errorMessage.functionReturnUndefinedOrNull}`);
  }
  const type = typeOf(res);
  if (!CORRECT_ANSWER.includes(type)) {
    error(`${res} | номер в массиве: ${index} - ${errorMessage.functionReturnIncorrectData}`)
  }
}

const TAG_TYPE_NODE = ["string", "function"];
const validatorTagNode = function(node) {
  Object.keys(node).forEach((key) => {
    if (!SUPPORTED_VARIABLES.includes(key)) {
      error(`${key} - ${errorMessage.useUnsupportedVariables}`);
    }
  });
  const { tag, props, child} = node;

  // check exist tag
  if(tag === undefined) {
    error(errorMessage.missTagOnObject);
  }

  if(!TAG_TYPE_NODE.includes(typeOf(tag))) {
    error(`${JSON.stringify(node)} - ${errorMessage.unsupportedTag}`)
  }

  if(props !== undefined) {
    validatorProps(props);
  }
  if(child !== undefined) {
    if(child !== undefined) {
      if (Array.isArray(child)) {
        validatorChild(child);
      } else {
        error(`Child может быть только типа array`);
      }
    }
  }
}

export {
  validatorMainNode,
  validateChildFunction,
  validatorTagNode,
  validSingleProps,
  validateFunctionAnswer
}