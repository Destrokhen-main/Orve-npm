/*
[X] - string | number   - prop 
[ ] - object            - prop
[X] - function          - prop event
[X] - proxy (st|num)    - prop
[X] - proxy (object)    - prop | style
[X] - string | number   - child
[ ] - proxy (st|num)    - child
[ ] - proxy (array)     - child

--mb--
[ ] - proxy (object)    - prop
[ ] - proxy (object)    - prop 
*/

/*

render = [
  {
    type: prop | child | propEvent
    node: ONode or Array<ONode>
  }
]

*/

import e, { message as m } from "./error";
import { ProxyType } from "./type";
import { typeOf } from "../usedFunction/typeOf";
import { PropsTypeRef } from "../reactive/ref";
import * as reactToCSS from "react-style-object-to-css";
import { parseChildren } from "../dom/builder/children";
import { childF } from "../dom/mount/child";

function updated() {
  if (this.parent.length > 0) {
    const call = this.func();
    if (call === undefined) {
      e("UNDEFINED");
    }

    this.parent.forEach((item: any) => {
      if (item.type === PropsTypeRef.PropStatic) {
        if (call !== this.value) {
          item.ONode.node.setAttribute(item.key, call);
          this.value = call;
        }
        return;
      }

      if (item.type === PropsTypeRef.PropEvent) {
        if (this.value.toString() !== call.toString()) {
          item.ONode.node.removeEventListener(item.key, this.value);
          item.ONode.node.addEventListener(item.key, call);
          this.value = call;
        }
        return;
      }

      if (item.type === PropsTypeRef.EffectStyle) {
        let style = "";
        if (typeof call === "string") {
          style = call;
        } else if (typeof call === "object") {
          style = reactToCSS(call);
        }

        if (style.length > 0 && this.value !== style) {
          item.ONode.node.setAttribute("style", style);
          this.value = style;
        }
      }

      if (item.type === PropsTypeRef.EffectImg) {
        if (typeof call === "string") {
          item.ONode.node.setAttribute(item.key, call);
        } else if (typeof call === "object") {
          item.ONode.node.setAttribute(item.key, call.default as string);
        }
        this.value = call;
      }

      if (item.type === PropsTypeRef.EffectChild) {
        console.log("s", this.value, call);
        if (this.value === null || this.value.toString() !== call.toString()) {
          const parseCall = parseChildren.call(null,  Array.isArray(call) ? call : [ call ] , null, item.parent)
          const [ node ] = childF(null, parseCall);
          item.value.node.replaceWith((node as any).node);

          item.value = node;
          this.value = call;
        }
      }
    });

    checkParent(this);
  }
}

function checkParent(item = null) {
  const i = item === null ? this : item;

  i.parent = i.parent.filter((e) => {
    if (document.body.contains(e.value.node)) {
      return true;
    }
  })
}

function effect(func: () => any, dependencies: Array<any>) {
  if (!Array.isArray(dependencies)) {
    e(m.EFFECT_DECENCIES_NOT_A_ARRAY);
  }

  const object = {
    value: null,
    render: [],
    func,
    parent: [],
    typeOutPut: null,
    updated,
    checkParent
  };

  const proxy = new Proxy(object, {
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.Effect;
      if (prop in target) {
        return target[prop];
      }
      return undefined;
    },
    deleteProperty() {
      console.error("effect - You try to delete prop in effect");
      return false;
    },
  });

  if (dependencies.length > 0) {
    dependencies.forEach((item) => {
      const type = typeOf(item);
      if (type !== ProxyType.Proxy) {
        e(m.DEP_NOT_A_PROXY);
      }

      const t = item.proxyType;
      if (t === ProxyType.RefO) {
        item.$parent.push({
          type: "Effect",
          value: proxy,
        });
      } else {
        item.parent.push({
          type: "Effect",
          value: proxy,
        });
      }
    });
  }
  return proxy;
}

export { effect };
