import errorMessage from "../error/errorMessage";
import error from "../error/error";
import { validatorMainNode, validatorTagNode } from "../linter/index.js";


import { typeOf } from "../helper/index";

import Type from "./type";
import { Node } from "../tsType";

import reqChild from "./children";

const recursive = (node: Node) => {
  let haveDop = false;
  let functionObject : object = {};

  const { tag, props, child } : Node = node;

  if (props !== undefined) {
    functionObject = props;
    haveDop = true;
  }

  if (child !== undefined) {
    functionObject["children"] = child.flat(1);
    haveDop = true;
  }

  const fTag : Node = haveDop 
    ? tag(functionObject) 
    : tag();
  
  if (typeOf(fTag) !== "object") {
    error(`rec-func - ${errorMessage.functionInTagReturn}`);
  }

  validatorTagNode(fTag);

  if (typeof fTag["tag"] === "function") {
    return recursive(fTag);
  }

  return fTag;
}

export default (app: () => Node) => {
  if (typeOf(app) !== "function") error(`${app} - ${errorMessage.appNotAFunction}`);
  
  let mainNode : Node = app();

  if (typeOf(mainNode) !== "object") error(`${mainNode} - ${errorMessage.resultCallNotAObject}`);
  
  // check mainNode
  validatorMainNode(mainNode);

  // if tag have function
  if (typeof mainNode["tag"] === "function") {
    mainNode = recursive(mainNode);
  }

  let { props, child } = mainNode;

  if (child !== undefined) {
    child = reqChild(props, child);
  }
  mainNode["type"] = Type.Component;
  return mainNode;
}