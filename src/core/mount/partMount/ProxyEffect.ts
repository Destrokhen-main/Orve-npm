import { typeOf } from "../../helper/index";

export default (app : HTMLElement, ch: any, callback: any) => {
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
    // NOTE need valid
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