import { typeOf } from "../../helper/index";
import { Type } from "../../tsType/type";
import { validatorTagNode } from "../../linter/index";
import { builder } from "../../builder/index";
import { objectToArray } from "../../helper/index";

const hasComponentInArray = (e) => {
  for (let i = 0; i !== e.length; i++) {
    if (e[i]["tag"] !== undefined) {
      return true;
    }
  }
  return false;
};

export default function (app: HTMLElement, ch: any, callback: any) {
  const type = typeOf(ch.value);
  if (type === "string" || type === "number") {
    const el = document.createTextNode(ch.value);
    ch.node = el;
    ch.proxy.parent.push({
      type: "child",
      value: el,
      node: this,
    });
    app.appendChild(el);
    return ch;
  } else if (type === "object") {
    if (ch.value["tag"] !== undefined) {
      if (ch.value["child"] !== undefined) {
        ch.value["child"] = objectToArray(ch.value["child"]);
      }
      validatorTagNode(ch.value);
      const c = builder(() => ch.value);
      const el = callback(app, c);
      ch.proxy.parent.push({
        type: Type.Component,
        value: el,
        node: this,
      });
      return el;
    } else {
      const el = document.createTextNode(JSON.stringify(ch.value));
      app.appendChild(el);
      ch.proxy.parent.push({
        type: "object-notComponent",
        value: el,
        node: this,
      });
      return el;
    }
  } else if (type === "array") {
    if (!hasComponentInArray(ch.value)) {
      const el = document.createTextNode(JSON.stringify(ch.value));
      app.appendChild(el);
      ch.proxy.parent.push({
        type: "array-notComponent",
        value: el,
      });
      return el;
    } else {
      ch.value = ch.value.map((e, i) => {
        if (e["child"] !== undefined) {
          e["child"] = objectToArray(e["child"]);
          validatorTagNode(e);

          const c = builder(() => e);
          const el = callback(app, c);
          return {
            key: i,
            ...el,
          };
        }
        return e;
      });
      ch.proxy.parent.push({
        type: Type.ArrayComponent,
        value: ch.value,
        node: this,
      });
      ch.proxy.lastCall = ch.value;
    }
  } else if (type === "proxy") {
    console.log("proxy");
  }
}
