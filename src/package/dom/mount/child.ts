import { ONode, TypeNode } from "../types";
import { Child, ChildType } from "../builder/children";
import { mountedNode } from "./index";
import { RefProxy } from "../../reactive/type";
import { PropsTypeRef, ChildRef } from "../../reactive/ref";
import { message as m } from "./error";
import { parseChildren } from "../builder/children";

export function formatedRef(item: any, val: any | null = null): any {
  let value = val !== null ? val : item.value.value;
  if (item.formate !== undefined) {
    try {
      value = item.formate(value);
      if (!["string", "number", "function", "boolean"].includes(typeof value)) {
        console.warn(
          "formate can return only string, number, function, boolean",
        );
        value = val !== null ? val : item.value.value;
      }
    } catch (e) {
      console.warn(`ref formate ${value} return error`);
    }
  }
  return value;
}

export const childF = function (
  tag: HTMLElement | null,
  nodes: Array<ONode | Child>,
): any {
  return nodes.map((item: ONode | Child) => {
    if (item === undefined) {
      console.warn("Mounted: " + m.UNDEFINED_IN_MOUNT);
      return undefined;
    }

    if (item.type === ChildType.HTML) {
      if (item.value !== null) {
        const element = new DOMParser()
          .parseFromString(item.value as string, "text/html")
          .getElementsByTagName("body")[0];
        (item as any).node = element.firstChild;
        if (tag !== null) tag.appendChild(element.firstChild as HTMLElement);
        return item;
      }
    }

    if (item.type === ChildType.HTMLPROP) {
      const element = new DOMParser()
        .parseFromString(item.value as string, "text/html")
        .getElementsByTagName("body")[0];

      if (tag !== null) {
        for (let i = 0; i !== element.childNodes.length; i++) {
          tag.appendChild(element.childNodes[i].cloneNode(true));
        }
        return undefined;
      } else return undefined;
    }

    if (item.type === ChildType.Static) {
      const r = /(&#(\d+);)/g;
      if (r.test((item as Child).value.toString())) {
        // TODO Возможно плохой вариант.
        (item as Child).value = (item as Child).value
          .toString()
          .replace(/(&#(\d+);)/g, function (a, b, charCode) {
            return String.fromCharCode(charCode);
          });
      }

      const element = document.createTextNode((item as Child).value.toString());
      if (tag !== null) tag.appendChild(element);
      item.node = element;
      return item;
    }

    if (item.type === TypeNode.Component) {
      return mountedNode.call(this, tag as HTMLElement, item as ONode) as ONode;
    }

    if (item.type === ChildType.ReactiveStatic) {
      const objectRef: Record<string, any> = item;
      const value = formatedRef(objectRef);

      const element = document.createTextNode(value);
      objectRef.node = element;
      if (tag !== null) tag.appendChild(element);
      const parentObject = {
        type: PropsTypeRef.Child,
        node: element,
        ONode: objectRef.ONode,
      } as ChildRef;

      if (objectRef.formate !== undefined) {
        parentObject["formate"] = objectRef.formate;
      }

      (objectRef.value as RefProxy).parent.push(parentObject);
      return objectRef;
    }

    if (item.type === ChildType.ReactiveComponent) {
      const element = mountedNode.call(this, tag, (item as any).value);
      (item as any).proxy.parent.push({
        type: ChildType.ReactiveComponent,
        ONode: element,
        parent: item.ONode,
      });
    }

    if (item.type === ChildType.ReactiveArray) {
      if ((item.value as any).length !== 0) {
        const items = childF.call(this, tag, (item as any).value);
        item.value = items;
        (item as any).proxy.render = items;
        (item as any).proxy.parentNode = (item as any).parent;
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
      const [node] = childF.call(this, tag, [(item as any).value]);

      (item as any).proxy.checkParent();
      (item as any).proxy.parent.push({
        type: "EffectChild",
        proxy: item,
        value: node,
        typeChanges: (item as any).typeChanges,
        parent: (item as any).parent,
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
        const pr = parseChildren.call(
          this,
          [(item.value as any).block1],
          null,
          (item as any).parent,
        );
        const [block] = childF.call(this, tag, pr);
        (item.value as any).node = block.node;
        (item.value as any).compilerNode = pr[0];
      } else {
        if ((item.value as any).block2 !== null) {
          const pr = parseChildren.call(
            this,
            [(item.value as any).block2],
            null,
            (item as any).parent,
          );
          const [block] = childF.call(this, tag, pr);
          (item.value as any).node = block.node;
          (item.value as any).compilerNode = pr[0];
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
