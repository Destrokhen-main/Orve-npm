import { Type } from "../tsType/type";

import ProxyEffect from "./partMount/ProxyEffect";

import { VNode } from "../tsType"
 
export const addChild = (app : HTMLElement, child : Array<VNode>, callback) => {
  return child.map(ch => {
    if (ch.type === Type.HTMLCode) {
      app.innerHTML += ch.value;
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
      return callback(app, ch.value, ch.type);
    }

    if (ch.type === Type.Proxy) {
      const el = document.createTextNode(ch.value)
      ch.node = el;
      ch.proxy.parent.push({
        type: "child",
        value: el,
      });
      app.appendChild(el); 
      return ch;
    }

    if (ch.type === Type.ProxyComponent) {
      const el = callback(app, ch.value);
      ch.proxy.parent.push(el.node);
      return el;
    }

    if (ch.type === Type.ProxyEffect) {
      return ProxyEffect(app, ch, callback);
    }
  });
}