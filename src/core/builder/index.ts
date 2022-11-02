import errorMessage from "../error/errorMessage";
import error from "../error/error";
import { validatorMainNode, validatorTagNode } from "../linter/index";


import { typeOf } from "../helper/index";

import { Type } from "../tsType/type";
import { Node, VNode } from "../tsType";

import reqChild from "./children";
import recursive from "./recuriveFunction";

export const builder = function(app: () => Node) : VNode {
  if (typeOf(app) !== "function") {
    error(`${app} - ${errorMessage.appNotAFunction}`);
  }

  let mainNode : any = app.bind(this)();

  if (typeOf(mainNode) !== "object") {
    error(`${mainNode} - ${errorMessage.resultCallNotAObject}`);
  }
  
  if (mainNode["child"] !== undefined && typeOf(mainNode["child"]) !== "array") {
    mainNode["child"] = [ mainNode["child"] ];
  }

  // check mainNode
  validatorMainNode(mainNode);

  // if tag have function
  if (typeof mainNode["tag"] === "function") {
    mainNode = recursive.bind(this)(mainNode);
  }

  mainNode["type"] = Type.Component;

  if (mainNode["child"] !== undefined) {
    mainNode["child"] = reqChild.bind(this)(mainNode["props"], mainNode["child"]);
  }
  return mainNode;
}