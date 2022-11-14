import error from "../error/error.js";
import { typeOf } from "../helper/index.js";
import { ProxyType } from "../tsType/type";
import { Type } from "../tsType/type";

import { builder } from "../builder/index";
import { createNodeRebuild } from "../mount/rebiuld";
import { validatorTagNode } from "../linter/index";

import errMessage from "../error/effect";

export function effect(callback, dependency = []) {
  if (typeof callback !== "function") {
    error(errMessage.NEED_FINCTION);
  }

  if (Array.isArray(dependency) !== true) {
    error(errMessage.DEP_NEED_ARRAY);
  }

  const cb = callback();
  const object = {
    parent: [],
    value: cb,
    function: callback,
    lastCall: cb,
    startComp: null,
  };

  const proxy = new Proxy(object, {
    get(target, prop) {
      if (prop === "type") { 
        return "proxy"; 
      }
      if (prop === "typeProxy") { 
        return ProxyType.proxyEffect;
      }

      if (prop === "refresh") {
        const newFunction = target["function"]();

        if (target.parent.length > 0) {
          target.parent.forEach(p => {
            // string | object | function
            // string
            // TODO с типами проблема, надо как-то подправить
            if (p.type === "child") {
              if (p.value.nodeType === 3) {
                p.value.nodeValue = newFunction;
              }
            }
            if (p.type === "props") {
              if ( newFunction === "") {
                p.value.removeAttribute(p.key);
              } else {
                p.value.setAttribute(p.key, newFunction);
              }
            }
            if (p.type === "watch") {
              p.function(newFunction, target["value"]);
            }
            if (p.type === "object-notComponent" || p.type === "array-notComponent") {
              p.value.textContent = JSON.stringify(newFunction);
            }
            if (p.type === Type.Component) {
              if (newFunction["child"] !== undefined && !Array.isArray(newFunction["child"])) {
                newFunction["child"] = [newFunction["child"]];
              }
              validatorTagNode(newFunction);
              const newComp = builder.bind(window.sReact.sReactContext)(() => newFunction);
              const mounted = createNodeRebuild(null, newComp);
              p.value.node.replaceWith(mounted);
              p.value.node = mounted;
            }
            if (p.type === Type.ArrayComponent) {
              const parsed = newFunction.map((e, i) => {
                if (e["child"] !== undefined && !Array.isArray(e)) {
                  e["child"] = [e["child"]];
                }
                validatorTagNode(e);
                const c = builder.bind(window.sReact.sReactContext)(() => e);
                const el = createNodeRebuild(null, c);
                // console.log(el);
                return {
                  key: i,
                  ...c,
                  node: el,
                }
              });

              if (target.lastCall.length === parsed.length) {
                target.lastCall = target.lastCall.map((e) => {
                  const obj = parsed.find(l => l.key === e.key);
                  if (obj) {
                    e.node.replaceWith(obj.node);
                    e = obj;
                  }
                })
              } else if (target.lastCall.length > parsed.length) {
                target.lastCall = target.lastCall.map((e) => {  
                  const obj = parsed.find(l => l.key === e.key);
                  if (obj) {
                    e.node.replaceWith(obj.node);
                    e = obj;
                  }
                  return e;   
                });
                
                for(let i = parsed.length;i !== target.lastCall.length; i++) {
                  target.lastCall[i].node.remove()
                }
                target.lastCall.splice(parsed.length, target.lastCall.length);
              } else if (target.lastCall.length < parsed.length) {
                parsed.forEach((e) => {
                  const obj = target.lastCall.find(l => l.key === e.key);
                  if (obj) {
                    // TODO проверять равны ли элементы
                    obj.node.replaceWith(e.node);
                    obj.node = e.node;
                  } else {
                    target.lastCall[target.lastCall.length - 1].node.insertAdjacentElement('afterend', e.node);
                    target.lastCall.push(e);
                  }
                });
              }
              //console.log(target.lastCall);
              //target.lastCall = parsed;
            }
          });
        }

        return true;
      }

      if (prop in target) {
        return target[prop];
      }
    },
    set(target, prop, value) {
      if (prop === "function" || prop === "value") return false;
      if (prop in target) {
        target[prop] = value;
        return true;
      } else {
        return false;
      }
    }
  })

  dependency.forEach(i => {
    const type = typeOf(i);
    if (type !== "proxy") {
      error(errMessage.ONLY_PROXY);
    } else {
      i.parent.push({
        type: "effect",
        parent: proxy,
      })
    }
  });
  return proxy;
}