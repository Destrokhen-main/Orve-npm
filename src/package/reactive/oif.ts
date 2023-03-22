
/*
oif(
  () => {
    return true
  },
  {} | "" ,
  {} | "" | null
)
*/
import { ProxyType } from "./type";
import { parseChildren } from "../dom/builder/children";
import { childF } from "../dom/mount/child";
import { Orve } from "../default";


function updated() {
  const call = this.rule();
  if (typeof call !== "boolean") {
    console.error("rule return not a boolean");
  } else {
    if (call !== this.lastCall) {
      const block = call ? this.block1 : this.block2;
      if (block !== null) {
        const bl =  parseChildren.call(Orve.context, [ block ], null, this.parentNode);
        const [ mount ] = childF(null, bl);
        this.node.replaceWith((mount as any).node);
        this.node = (mount as any).node;
      } else {
        const comment = document.createComment(
          ` if `,
        );
        this.node.replaceWith(comment);
        this.node = comment;
      }

      this.lastCall = call;
    }
  }
}

function oif(rule : (() => boolean), dependencies: any[], block1: any, block2: any | null = null) {
  //
  if (typeof rule !== "function") {
    console.error("first argument need to be a function");
    return;
  }

  if (block1 === undefined || block1 === null) {
    console.error("positive block not specified");
    return;
  }

  if (!Array.isArray(dependencies)) {
    console.error("dependencies not a array")
  }

  const object = {
    parent: [],
    rule,
    lastCall: null,
    node: null,
    parentNode: null,
    block1,
    block2,
    updated
  }

  const proxy = new Proxy(object, {
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.Oif;
      return Reflect.get(target, prop);
    },
    set(target, props, value) {
      return Reflect.set(target, props, value);
    },
    deleteProperty() {
      console.error("oif - You try to delete prop in oif");
      return false;
    },
  });

  if (dependencies.length > 0) {
    dependencies.forEach((e) => {
      const type = e.type;
      if (type !== ProxyType.Proxy) {
        console.error(`${e} - dependencie not Orve proxy`);
      }
      const typeProxy = e.proxyType;

      if (typeProxy === ProxyType.RefO) {
        e.$parent.push({
          type: ProxyType.Oif,
          value: proxy,
        });
      } else {
        e.parent.push({
          type: ProxyType.Oif,
          value: proxy,
        });
      }
    });
  }
  return proxy;
}

export { oif };