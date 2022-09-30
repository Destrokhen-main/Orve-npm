import { Type } from "../tsType/type";

import { typeOf } from "../helper/index";
 
export const addChild = (app, child, callback) => {
  return child.map(ch => {
    if (ch.type === Type.NotMutable) {
      const el = document.createTextNode(ch.value);
      app.appendChild(el);
      return ch;
    }

    if (ch.type === Type.Component || ch.type === Type.ComponentMutable) {
      return callback(app, ch.value);
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
      const type = typeOf(ch.value);
      if (type === "string" || type === "number") {
        const el = document.createTextNode(ch.value)
        ch.node = el;
        ch.proxy.parent.push({
          type: "child",
          value: el,
        });
        app.appendChild(el); 
        return ch;
      } else if (type === "object") {
        // NOTE mb need valid
        const el = callback(app, ch.value);
        ch.proxy.parent.push({
          type: "component",
          value: el
        });
        return el;
      } else if (type === "proxy") {
        console.log("proxy");
      }
    }
  });
}