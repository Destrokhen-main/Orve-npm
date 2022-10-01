import errorMessage from "../error/errorMessage";
import error from "../error/error";
import { validatorMainNode, validatorTagNode } from "../linter/index";


import { typeOf } from "../helper/index";

import { Type } from "../tsType/type";
import { Node, VNode } from "../tsType";

import reqChild from "./children";

interface Props {
  children?: Array<Node>
}

const recursive = (node: Node) => {
  let haveDop = false;
  let propsCh : Props = {};

  const { tag, props, child }: Node = node;

  if (props !== undefined) {
    propsCh = props;
    haveDop = true;
  }

  if (child !== undefined) {
    propsCh["children"] = child.flat(1);
    haveDop = true;
  }

  const fTag : any = haveDop 
    ? tag(propsCh) 
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

export const builder = (app: () => Node) : VNode => {
  if (typeOf(app) !== "function") error(`${app} - ${errorMessage.appNotAFunction}`);
  
  let mainNode : VNode = app();

  if (typeOf(mainNode) !== "object") error(`${mainNode} - ${errorMessage.resultCallNotAObject}`);
  
  // check mainNode
  validatorMainNode(mainNode);

  // if tag have function
  if (typeof mainNode["tag"] === "function") {
    mainNode = recursive(mainNode);
  }
  mainNode["type"] = Type.Component;
  let { props, child } = mainNode;

  if (child !== undefined) {
    mainNode["child"] = reqChild(props, child);
  }
  return mainNode;
}