import { addProps } from "./addProps";
import { addChild } from "./addChild";

const cNode = function (app: HTMLElement | null, node: any) {
  const { tag, props, child, ref } = node;
  const Tag = document.createElement(tag);
  node["node"] = Tag;
  if (node["hooks"] !== undefined && node["hooks"]["mounted"] !== undefined) {
    node["hooks"]["mounted"]({ ...window.sReact.sReactContext, ...node });
  }

  if (props !== undefined && Object.keys(props).length > 0) {
    addProps.bind(node)(Tag, props);
  }
  if (child !== undefined && child.length > 0) {
    node["child"] = addChild.bind(node)(Tag, child, cNode);
  }

  if (ref !== undefined) {
    ref.value = Tag;
  }
  Tag.addEventListener("DOMNodeRemoved", () => {
    if (node["hooks"]?.unmounted) {
      node["hooks"].unmounted({ ...window.sReact.sReactContext, ...node });
    }
  })
  if (app === null) return Tag;
  app.appendChild(Tag);
  return node;
};

export const createNode = cNode;
