import er, {message as m} from "./error";
import { ONodeOrve, HookObject, TypeNode } from "../types";
import { propsF } from "./props";

import { childF } from "./child";
import { Child } from "../builder/children";

import { RefLProxy } from "../../reactive/type";


function mount(query: string): void {
  const tag: HTMLElement = document.querySelector(query);
  const oNode : ONodeOrve = window.orve.DOM;

  if (tag === null) {
    er(`${m.TAG_NOT_FOUND} "${query}"`);
  }

  window.orve.DOM = mountedNode.call(this, tag, oNode);
}


function mountedNode(app: HTMLElement | null, nodes: ONodeOrve): ONodeOrve | HTMLElement {
  const { tag, props, child, ref, hooks } = nodes;

  if (tag === "comment") {
    const comment = document.createComment(`refC - ${nodes.keyNode}`);
    const object = {
      ...nodes,
      node: comment,
      type: TypeNode.Comment
    } as ONodeOrve;

    if (app === null) return object;

    app.appendChild(comment);
    return object;
  }
  if (typeof tag !== "string") {
    er(m.TAG_NOT_A_STRING);
  }
  const TAG = document.createElement((tag as string).toLowerCase());

  if (hooks && hooks.mounted) {
    nodes["node"] = TAG;

    const sendObject = Object.assign({}, nodes);
    delete sendObject["hooks"];

    hooks.mounted({
      context: this,
      oNode: sendObject
    } as HookObject)
  }

  if (props && Object.keys(props).length > 0) {
    propsF.call({ context: this, ONode: nodes }, TAG, props);
  }

  if (child && (child as Array<ONodeOrve | Child>).length > 0) {
    nodes["child"] = childF.call(this, TAG, child);
  }

  if (ref !== undefined) {
    (ref as RefLProxy).value = TAG;
  }

  nodes["node"] = TAG;

  if (app === null) return nodes
  
  app.appendChild(TAG);
  return nodes;
}

export {
  mount,
  mountedNode
}
