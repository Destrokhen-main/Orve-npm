import er, { message as m } from "./error";
import { ONode, TypeNode } from "../types";
import { propsF } from "./props";

import { childF } from "./child";
import { Child } from "../builder/children";
import { ChildType } from "../builder/children";

import { Orve } from "../../default";

function mount(query: string): void {
  const tag: HTMLElement | null = document.querySelector(query);
  const oNode: ONode = Orve.tree;

  if (tag === null) {
    er(`${m.TAG_NOT_FOUND} "${query}"`);
  }

  Orve.tree = mountedNode.call(Orve.context, tag, oNode);
}

function createComment(app: HTMLElement | null, nodes: ONode | any ): ONode {
  let text = "";
  if (nodes.child !== undefined && Array.isArray(nodes.child) && nodes.child.length > 0) {
    text = nodes.child.reduce((a: string, b: any) => {
      if (b.type !== undefined && b.type === ChildType.Static) {
        return a += String(b.value);
      }
      return String(a);
    }, "");
  }

  const comment: Comment = document.createComment(
    ` ${text.length > 0 ? text + " - " : ""}${nodes.keyNode}`,
  );
  const object = {
    ...nodes,
    node: comment,
    type: TypeNode.Comment,
  } as ONode;

  if (nodes["$refOParams"] !== undefined) {
    const prop = nodes["$refOParams"].prop;
    const indexF = nodes["$refOParams"].proxy.$reactiveParams.findIndex((x: Record<string, any>) => x.nameValue === prop);
    if (indexF !== -1) {
      nodes["$refOParams"].proxy.$reactiveParams[indexF].node = comment;
    }
  }

  if (app === null) return object;

  app.appendChild(comment);
  return object;
}


function createFragment(app: HTMLElement | null, nodes: ONode) {
  if (nodes.child !== undefined) {
    const child = childF(app, nodes.child);
    console.log(child);
    nodes.child = child;
  }
  return nodes;
}

function mountedNode(
  app: HTMLElement | null,
  nodes: ONode,
): ONode | HTMLElement | undefined {
  const { tag, props, child, ref, hooks } = nodes;

  if (typeof tag !== "string") {
    er(m.TAG_NOT_A_STRING);
    return;
  }

  if (tag.trim() === "comment") {
    return createComment(app, nodes);
  }

  if (tag.trim() === "fragment") {
    const fr = createFragment(app, nodes);
    console.log("fragment creater", fr);
    return fr;
    // return createFragment(app, nodes);
  }

  const TAG = document.createElement(tag.trim().toLowerCase());

  if (hooks && hooks.mounted) {
    nodes["node"] = TAG;
    hooks.mounted({
      context: Orve.context,
      oNode: nodes,
    });
  }

  if (props && Object.keys(props).length > 0) {
    propsF.call({ context: this, ONode: nodes }, TAG, props);
  }

  if (child && (child as Array<ONode | Child>).length > 0) {
    nodes["child"] = childF.call(this, TAG, child);
  }

  if (ref !== undefined) {
    ref.value = TAG;
  }

  nodes["node"] = TAG;

  if (app === null) return nodes;

  if (nodes.parent === null) {
    app.replaceWith(TAG);
  } else {
    app.appendChild(TAG);
  }
  return nodes;
}

export { mount, mountedNode };
