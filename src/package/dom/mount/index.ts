import er, {message as m} from "./error";
import { ONodeOrve, HookObject, TypeNode } from "../types";
import { propsF } from "./props";

import { childF } from "./child";
import { Child } from "../builder/children";

import { RefLProxy } from "../../reactive/type";
import { ChildType } from "../builder/children";


function mount(query: string): void {
  const tag: HTMLElement = document.querySelector(query);
  const oNode : ONodeOrve = window.orve.DOM;

  if (tag === null) {
    er(`${m.TAG_NOT_FOUND} "${query}"`);
  }

  window.orve.DOM = mountedNode.call(this, tag, oNode);
}

function createComment(app : HTMLElement | null, nodes: ONodeOrve) {
  let text = "";
  if ((nodes.child as any) !== undefined && (nodes.child as Array<() => ONodeOrve | string | number | object>).length > 0) {
    text = (nodes.child as Array<any>).reduce((a : string, b : ONodeOrve) => {
      if ((b as any).type === ChildType.Static) {
        return a += (b as any).value;
      }
      return a;
    }, "");
  }

  const comment = document.createComment(` ${text.length > 0 ? text + " - " : ""}${nodes.keyNode}`);
  const object = {
    ...nodes,
    node: comment,
    type: TypeNode.Comment
  } as ONodeOrve;

  if (app === null) return object;

  app.appendChild(comment);
  return object;
}


function mountedNode(app: HTMLElement | null, nodes: ONodeOrve): ONodeOrve | HTMLElement {
  const { tag, props, child, ref, hooks } = nodes;

  if (typeof tag !== "string") {
    er(m.TAG_NOT_A_STRING);
  }

  if ((tag as string).trim() === "comment") {
    // if user add comment
    return createComment(app, nodes);
  }

  const TAG = document.createElement((tag as string).trim().toLowerCase());

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
  
  if (nodes.parent === null) {
    app.replaceWith(TAG);
  } else {
    app.appendChild(TAG);
  }
  return nodes;
}

export {
  mount,
  mountedNode
}
