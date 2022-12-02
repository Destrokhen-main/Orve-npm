import { ONodeOrve, TypeNode } from "../types";
import { Child, ChildType } from "../builder/children";
import { mountedNode } from "./index";
import { message as m } from "./erMessage";

export const childF = function(
  tag: HTMLElement,
  nodes: Array<ONodeOrve | Child>
) : Array<ONodeOrve | Child> {
  return nodes.map((item: ONodeOrve | Child) => {
    if (item.type === ChildType.HTML) {
      const element = new DOMParser()
        .parseFromString(item.value as string, "text/html")
        .getElementsByTagName("body")[0];
      item.node = element.firstChild;
      tag.appendChild(element.firstChild);
      return item;
    }

    if (item.type === ChildType.Static) {
      const r = /&#+[0-9]+;/gm;
      if (r.test((item as Child).value.toString())) {
        console.warn(`${m.INSERT_HTML_IN_STATIC} <span>${item.value}</span>`);
      }

      const element = document.createTextNode((item as Child).value.toString());
      tag.appendChild(element);
      item.node = element;
      return item;
    }

    if (item.type === TypeNode.Component) {
      return mountedNode.call(this, tag as HTMLElement, item as ONodeOrve) as ONodeOrve;
    }
    return item;
  })
}