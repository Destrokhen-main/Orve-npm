import { typeOf } from "../../helper/index";
import { Type } from "../../tsType/type"

export default function(app : HTMLElement, ch: any, callback: any) {
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
    if (ch.value["tag"] !== undefined) {
      // NOTE need valid
      const el = callback(app, ch.value);
      ch.proxy.parent.push({
        type: Type.Component,
        value: el
      });
      return el;
    } else {
      const el = document.createTextNode(JSON.stringify(ch.value));
      app.appendChild(el);
      ch.proxy.parent.push({
        type: "object-notComponent",
        value: el
      })
      return el;
    }
  } else if (type === "proxy") {
    console.log("proxy");
  }
}