import error from "../error/error";
import { typeOf } from "../helper/index";
import { ProxyType } from "../tsType/type";
import { Type } from "../tsType/type";

import { builder } from "../builder/index";
import { createNodeRebuild } from "../mount/rebiuld";
import { validatorTagNode } from "../linter/index";
import { objectToArray } from "../helper";

import errMessage from "../error/effect";

export function effect(callback, dependency = []) {
  if (typeof callback !== "function") {
    error(errMessage.NEED_FUNCTION);
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
          target.parent.forEach((p) => {
            // string | object | function
            // string
            // TODO с типами проблема, надо как-то подправить
            if (p.type === "child") {
              if (p.value.nodeType === 3) {
                p.value.nodeValue = newFunction;
              }
            }
            if (p.type === "props") {
              if (newFunction === "") {
                p.value.removeAttribute(p.key);
              } else {
                p.value.setAttribute(p.key, newFunction);
              }
            }
            if (p.type === "watch") {
              p.function(newFunction, target["value"]);
            }
            if (
              p.type === "object-notComponent" ||
              p.type === "array-notComponent"
            ) {
              p.value.textContent = JSON.stringify(newFunction);
            }
            if (p.type === Type.Component) {
              if (newFunction["child"] !== undefined) {
                newFunction["child"] = objectToArray(newFunction["child"]);
              }
              validatorTagNode(newFunction);
              const newComp = builder.bind(window.sReact.sReactContext)(
                () => newFunction,
              );
              const mounted = createNodeRebuild(null, newComp);
              p.value.node.replaceWith(mounted);
              p.value.node = mounted;
            }
            if (p.type === Type.ArrayComponent) {
              const parsed = newFunction.map((e, i) => {
                if (e["child"] !== undefined) {
                  e["child"] = objectToArray(e["child"]);
                }
                validatorTagNode(e);
                const c = builder.bind(window.sReact.sReactContext)(() => e);
                const el = createNodeRebuild(null, c);
                // console.log(el);
                return {
                  ...c,
                  key: c.key !== undefined ? c.key : i,
                  node: el,
                };
              });
              if (target.lastCall.length === parsed.length) {
                target.lastCall = target.lastCall.map((e) => {
                  const obj = parsed.find((l) => l.key === e.key);
                  if (obj) {
                    e.node.replaceWith(obj.node);
                    e = obj;
                  }
                });
              } else if (target.lastCall.length > parsed.length) {
                //console.log(parsed, target.lastCall);
                for (let i = 0; i !== target.lastCall.length; i++) {
                  const obj = parsed.find(
                    (e) => e.key === target.lastCall[i].key,
                  );
                  if (!obj) {
                    target.lastCall[i].node.remove();
                    delete target.lastCall[i];
                  } else {
                    target.lastCall[i].node.replaceWith(obj.node);
                    target.lastCall[i] = obj;
                  }
                }
                target.lastCall = target.lastCall.filter(
                  (e) => typeof e !== undefined,
                );
              } else if (target.lastCall.length < parsed.length) {
                parsed.forEach((e) => {
                  const obj = target.lastCall.findIndex((l) => l.key === e.key);
                  //console.log(e, target.lastCall[obj]);
                  if (target.lastCall[obj] !== undefined) {
                    // TODO проверять равны ли элементы
                    target.lastCall[obj].node.replaceWith(e.node);
                    target.lastCall[obj] = e;
                  } else {
                    target.lastCall[
                      target.lastCall.length - 1
                    ].node.insertAdjacentElement("afterend", e.node);
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
    },
  });

  dependency.forEach((i) => {
    const type = typeOf(i);
    if (type !== "proxy") {
      error(errMessage.ONLY_PROXY);
    } else {
      i.parent.push({
        type: "effect",
        parent: proxy,
      });
    }
  });
  return proxy;
}
