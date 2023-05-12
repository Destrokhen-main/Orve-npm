import { ONode, TypeNode, Props } from "../types";
import er, { message as m } from "./error";
import { typeOf } from "../../usedFunction/typeOf";
import { isONode } from "../builder/validator";
import { parseChildren } from "./children";
import { recursiveTag } from "./recursiveTag";
import { ProxyType } from "../../reactive/type";
import { generationID } from "../../usedFunction/keyGeneration";
import { Node } from "../../jsx";


type ComponentType = Record<string, any> | ((args?: Record<string, any>) => any);
function prepareComponent(component: ComponentType): (() => any) {
  let comp: Record<string, any> | ((args?: Record<string, any>) => any) = component;
  const typeComp = typeof comp;
  if (typeComp !== "function") {
    if (typeComp === "object") {
      comp = () => component;
    } else {
      er(m.APP_NOT_A_FUNCTION_OR_OBJECT);
    }
  }
  return comp as (() => any);
}


function parser(
  app: () => any | Record<string, any>,
  props: Props | null = null,
  parent: ONode | null = null,
) {
  // if app = {} or proxy;
  const component: ((args?: Record<string, any>) => any) = prepareComponent(app) as (() => any);

  let Node: Node | unknown = null;

  try {
    Node = props
    ? component.call(this, props)
    : component.call(this);
  } catch(error) {
    console.error(`${String(component).substring(0, 50)}... - ${error}`);
  } 

  if (component === null) {
    // TODO В зависимости от env отображать или нет это сообщение.
    Node = {
      tag: "span",
      child: [` ERROR WITH COMPONENT - ${String(component).substring(0, 50)}... `]
    }
  }

  const typeNode = typeOf(Node);

  if (typeNode !== "object") {
    console.warn(`component: ${String(component).substring(0, 50)}... \n${m.CALL_NODE_RETURN_NOT_A_OBJECT}`);
    return undefined;
  }

  let node: Node | undefined = Node as Node;

  if (node.child && !Array.isArray(node.child)) {
    node["child"] = [ node.child ];
  }

  // check if node have all need key
  isONode(node);

  if (typeof node.tag === "function") {
    node = recursiveTag.call(this, node);
  }

  if (node === undefined) {
    return undefined;
  }

  const oNode: ONode = {
    ...node,
    node: null,
    keyNode: generationID(16),
    type: TypeNode.Component,
    parent: parent ? parent : null, 
  };


  // NOTE возможно будут проблемы с этим куском.
  if (oNode.html) {
    oNode.child = [ oNode.html ];
  }

  // NOTE work with CHILD
  if (oNode.child) {
    oNode.child = parseChildren.call(this, oNode.child, props, oNode);
  }

  // NOTE hook created
  if (oNode.hooks && oNode.hooks.created) {
    const toHook = { ...oNode };
    delete toHook.child;

    oNode.hooks.created({
      context: this,
      oNode: toHook,
    });
  }

  if (oNode.ref !== undefined) {
    if (typeof oNode.ref === "object") {
      const type = oNode.ref.type;
      const typeProxy = oNode.ref.proxyType;
      if (
        type === undefined ||
        type !== ProxyType.Proxy ||
        typeProxy === undefined ||
        typeProxy !== ProxyType.RefL
      ) {
        er(m.REFL_INSERT_NOT_A_PROXY);
      }
    } else {
      er(m.REFL_INSERT_NOT_A_PROXY);
    }
  }
  return oNode;
}

export { parser };
