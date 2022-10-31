import error from "../error/error.js";
import { typeOf } from "../helper/index.js";
import { ProxyType } from "../tsType/type";

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
    lastCall: cb
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

            // if (p.type === "array") {
            //   const ar = recursiveChild(null, newFunction);
            //   // target.lastCall.forEach((el: any) => {
            //   //   el.node.remove();
            //   // });
            //   const newAr = ar.map((el : any, index: number) => {
            //     const createEl = createNodeRebuild(null, el.value);
            //     if (target.lastCall.length > index) {
            //       target.lastCall[index].node.insertAdjacentElement('afterend', createEl);
            //       target.lastCall[index].node.remove();
            //     } else {
            //       target.lastCall[target.lastCall.length - 1].node.insertAdjacentElement('afterend', createEl);
            //     }
            //     //target.lastCall[target.lastCall.length - 1].node.remove();
            //     return {
            //       ...el,
            //       node: createEl,
            //     };
            //   });

            //   if (target.lastCall.length > newAr.length) {
            //     for(let i = newAr.length - 1 ;i !== target.lastCall.length; i++) {
            //       target.lastCall[i].node.remove();
            //     }
            //   }

            //   target.lastCall = newAr;
            // }

            // if (p.type === "object") {
            //   let newObj = builder(() => newFunction);
            //   const node  = createNodeRebuild(null, newObj);
            //   console.log(node);
            //   target.lastCall = node;
            //   // p.value.node.appendChild(node);
            //   //p.parentNode.remove();
            //   //p.parentNode = node;
            //   // p.parent = target.parent.map((el) => {
            //   //   el.node.insertAdjacentElement('afterend', node);
            //   //   el.node.remove();
            //   //   return node;
            //   // });
            // }
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