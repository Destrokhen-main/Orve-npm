import { Type } from "../tsType/type";

import ProxyEffect from "./partMount/ProxyEffect";

import { VNode } from "../tsType";

export const addChild = function (
  app: HTMLElement,
  child: Array<VNode>,
  callback: any,
) {
  return child.map((ch) => {
    if (ch.type === Type.HTMLCode) {
      const el = new DOMParser()
        .parseFromString(ch.value, "text/html")
        .getElementsByTagName("body")[0];
      app.appendChild(el.firstChild);
      return ch;
    }

    if (ch.type === Type.NotMutable) {
      const el = document.createTextNode(ch.value);
      app.appendChild(el);
      return ch;
    }

    if (
      ch.type === Type.Component ||
      ch.type === Type.ComponentMutable ||
      ch.type === Type.Layer
    ) {
      return callback(app, ch.value);
    }

    if (ch.type === Type.Proxy) {
      const el = document.createTextNode(ch.value);
      ch.node = el;
      ch.proxy.parent.push({
        type: "child",
        value: el,
        node: this,
      });
      app.appendChild(el);
      return ch;
    }

    if (ch.type === Type.ProxyComponent) {
      const el = callback(app, ch.value);
      ch.proxy.parent.push({ node: el.node, value: ch.value });
      return el;
    }

    if (ch.type === Type.ProxyEffect) {
      return ProxyEffect.bind(this)(app, ch, callback);
    }
  });
};
