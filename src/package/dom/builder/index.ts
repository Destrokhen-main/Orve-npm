import { ONode, ONodeOrve, TypeNode, Props } from "../types";
import er, { message as m } from "./error";
import { typeOf } from "../../usedFunction/typeOf";
import { isONode } from "../builder/validator"; 
import { parseChildren } from "./children";
import { recursiveTag } from "./recursiveTag";
import { RefLProxy, ProxyType } from "../../reactive/type";

function parser(
  app: () => unknown | ONode,
  props: Props = null,
  parent: ONodeOrve = null
) {
  // if app = {} or proxy;
  let component = app;
  const tComponent = typeof component;
  if (tComponent !== "function")
    if (tComponent === "object")
      component = () => app;
    else
      er(m.APP_NOT_A_FUNCTION_OR_OBJECT);

  const Node: ONode | unknown  = props ? component.call(this, props) : component.call(this);
  
  const typeNode = typeOf(Node);

  if (typeNode !== "object") {
    er(`component: ${component} \n${m.CALL_NODE_RETURN_NOT_A_OBJECT}`);
  }

  let workObj: ONode = Node as ONode;
  if (workObj.child && typeOf(workObj.child) !== "array") {
    workObj["child"] = [ workObj.child ];
  }

  // check if node have all need key
  isONode(workObj);

  if (typeof workObj.tag === "function") {
    workObj = recursiveTag.call(this, workObj);
  }

  const newNode: ONodeOrve = {
    ...workObj,
    node: null,
    type: TypeNode.Component,
    parent: parent ? parent : null
  }

  // NOTE work with CHILD
  if (newNode.child) {
    // work with child
    const s = Object.assign({}, newNode);
    delete s.child;
    newNode.child = parseChildren.call(this, newNode.child, props, s);
  }

  // hooks created
  if (newNode.hooks && newNode.hooks.created) {
    const toHook = Object.assign({}, newNode);
    delete toHook.child;

    newNode.hooks.created({
      context: this,
      oNode: toHook
    })
  }

  if (newNode.ref !== undefined) {
    if (typeof newNode.ref === "object") {
      const type = (newNode.ref as RefLProxy).type;
      const typeProxy = (newNode.ref as RefLProxy).typeProxy;
      if (type === undefined && type !== ProxyType.Proxy && typeProxy === undefined && typeProxy !== ProxyType.RefL) {
        er(m.REFL_INSERT_NOT_A_PROXY);
      }
    } else {
      er(m.REFL_INSERT_NOT_A_PROXY);
    }
  }
  return newNode;
}

export {
  parser
}