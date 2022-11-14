import { typeOf } from "../../helper/index";
import { Type } from "../../tsType/type";
import { validatorTagNode } from "../../linter/index";
import { builder } from "../../builder/index";

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
      if (ch.value["child"] !== undefined && !Array.isArray(ch.value["child"])) {
        ch.value["child"] = [ch.value["child"]];
      }
      validatorTagNode(ch.value);
      const c = builder(() => ch.value);
      const el = callback(app, c);
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
  } else if (type === "array") {
    const el = document.createTextNode(JSON.stringify(ch.value));
      app.appendChild(el);
      ch.proxy.parent.push({
        type: "array-notComponent",
        value: el
      })
      return el;
  } else if (type === "proxy") {
    console.log("proxy");
  }
}