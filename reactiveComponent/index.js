const Type = require("../type/proxy.js");

const builder = require("../core/builder/index.js");
const { createNodeRebuild } = require("../core/mount/rebiuld.js");
const { typeOf } = require("../core/helper/index.js");

const s = (component) => {
  let comp = component;
  const type = typeOf(component);
  if (type !== "function") {
    if (type === "object") {
      comp = () => component;
    }
  }

  const object = {
    parent: [],
    value: comp,
  }

  return new Proxy(object, {
    get(target, prop) {
      if (prop === "type") return "proxy";
      if (prop === "typeProxy") return Type.proxyComponent;
      if (prop in target) {
        return target[prop];
      }
    },
    set(target, prop, value) {
      if (prop in target) {
        let comp = value;
        if (prop === "value") {
          const type = typeOf(component);
          if (type !== "function") {
            if (type === "object") {
              comp = () => value;
            }
          }
        }

        target[prop] = value;

        if (prop === "value") {
          if (target.parent.length > 0) {
            let newObj = builder(comp);
            const object  = createNodeRebuild(null, newObj);
            target.parent = target.parent.map((el) => {
              el.insertAdjacentElement('afterend', object);
              el.remove();
              return object;
            })
          }
        }

        return true;
      }
      return false;
    }
  })
}

module.exports.refC = s;