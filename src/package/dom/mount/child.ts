import { ONodeOrve, TypeNode } from "../types";
import { Child, ChildType } from "../builder/children";
import { mountedNode } from "./index";
import { RefProxy } from "../../reactive/type";
import { PropsTypeRef, ChildRef } from "../../reactive/ref";
import { message as m } from "./error";
import { parseChildren } from "../builder/children";

export const childF = function (
  tag: HTMLElement,
  nodes: Array<ONodeOrve | Child>,
): Array<ONodeOrve | Child | Array<ONodeOrve | Child>> {
  return nodes.map((item: ONodeOrve | Child) => {
    if (item === undefined) {
      console.warn("Mounted: " + m.UNDEFINED_IN_MOUNT);
      return undefined;
    }

    if (item.type === ChildType.HTML) {
      const element = new DOMParser()
        .parseFromString(item.value as string, "text/html")
        .getElementsByTagName("body")[0];
      item.node = element.firstChild;
      if (tag !== null) tag.appendChild(element.firstChild);
      return item;
    }

    if (item.type === ChildType.Static) {
      const r = /&#+[0-9]+;/gm;
      if (r.test((item as Child).value.toString())) {
        console.warn(`${m.INSERT_HTML_IN_STATIC} <span>${item.value}</span>`);
      }

      const element = document.createTextNode((item as Child).value.toString());
      if (tag !== null) tag.appendChild(element);
      item.node = element;
      return item;
    }

    if (item.type === TypeNode.Component) {
      return mountedNode.call(
        this,
        tag as HTMLElement,
        item as ONodeOrve,
      ) as ONodeOrve;
    }

    if (item.type === ChildType.ReactiveStatic) {
      const element = document.createTextNode(
        (item.value as RefProxy).value as string,
      );
      item.node = element;
      if (tag !== null) tag.appendChild(element);
      (item.value as RefProxy).parent.push({
        type: PropsTypeRef.Child,
        node: element,
        ONode: item.ONode,
      } as ChildRef);
      return item;
    }

    if (item.type === ChildType.ReactiveComponent) {
      const element = mountedNode.call(this, tag, item.value);
      (item as any).proxy.parent.push({
        type: ChildType.ReactiveComponent,
        ONode: element,
        parent: item.ONode
      });
    }

    if (item.type === ChildType.ReactiveArray) {
      if ((item.value as any).length !== 0) {
        const items = childF.call(this, tag, item.value);
        item.value = items;
        (item as any).proxy.render = items;
        return item;
      } else {
        const comment = document.createComment(
          ` array ${(item as any).keyNode} `,
        );
        (item as any).proxy.render = comment;
        (item as any).proxy.parentNode = (item as any).parent;
        (item as any).proxy.keyNode = (item as any).keyNode;
        if (tag !== null) tag.appendChild(comment);
        return item;
      }
    }

    if (item.type === ChildType.Effect) {
      const [ node ] = childF.call(this, tag, [ item.value ]);
      (item as any).proxy.parent.push({
        type: "EffectChild",
        proxy: item,
        value: node,
        typeChanges: (item as any).typeChanges,
        parent: (item as any).parent
      });
      return item;
    }

    if (item.type === ChildType.Oif) {
      const call = (item.value as any).rule();
      if (typeof call !== "boolean") {
        return undefined;
      }
      (item.value as any).lastCall = call;
      if (call) {
        const pr = parseChildren.call(this, [ (item.value as any).block1 ], null, (item as any).parent);
        const [ block ] = childF.call(this, tag, pr);
        (item.value as any).node = block.node;
      } else {
        if((item.value as any).block2 !== null) {
          const pr = parseChildren.call(this, [ (item.value as any).block2 ], null, (item as any).parent);
          const [ block ] = childF.call(this, tag, pr);
          (item.value as any).node = block.node;
        } else {
          const comment = document.createComment(
            ` if ${(item as any).keyNode} `,
          );
          (item.value as any).node = comment;
          if (tag !== null) tag.appendChild(comment);
          return item;
        }
      }

      // if (call) {
      //   const [ block1 ] = childF.call(this, tag, [ (item.value as any).block1 ]);
      //   //item.value.
      // } else {
      //   if ((item.value as any).block2 !== null) {
      //     const [ block2 ] = childF.call(this, tag, [ (item.value as any).block2 ]);
      //   } else {

      //   }
      // }
    }
    return item;
  });
};
