import { addProps } from "./addProps";
import { addChild } from "./addChild";

const cNode = function(app : HTMLElement, node : any, type = null) {
  const { tag, props, child } = node;
  const Tag = document.createElement(tag);
  node["node"] = Tag;

  if (type !== null) {
    node["type"] = type;
  }

  if (props !== undefined && Object.keys(props).length > 0) {
    addProps(Tag, props, node);
  }
  if (child !== undefined && child.length > 0) {
    node["child"] = addChild(Tag, child, cNode);
  }
  app.appendChild(Tag);
  return node;
}

export const createNode = cNode;