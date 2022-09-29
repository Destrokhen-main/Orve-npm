const error = require("../error/error.js");
const { typeOf } = require("../helper/index.js");
const Type = require("../type/proxy.js");

module.exports.effect = (callback, dependency = []) => {
  if (typeof callback !== "function") {
    error(`Первым параметром должна идти функция`);
  }

  if (Array.isArray(dependency) !== true) {
    error("Зависимости могут быть только в массиве");
  }

  const object = {
    parent: [],
    value: callback(),
    function: callback
  };
  const proxy = new Proxy(object, {
    get(target, prop) {
      if (prop === "type") return "proxy";
      if (prop === "typeProxy") return Type.proxyEffect;

      if (prop === "refresh") {
        const newFunction = target["function"]();

        if (target.parent.length > 0) {
          target.parent.forEach(p => {
            // string | object | function
            // string
            if (p.type === "child") {
              if (p.type === "child") {
                if (p.value.nodeType === 3) {
                  p.value.nodeValue = newFunction;
                }
              }
            }
            if (p.type === "props") {
              p.value.setAttribute(p.key, newFunction);
            }
            if (p.type === "watch") {
              p.function(newFunction, target["value"]);
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
      error("Вы попытались засунуть в зависимости не proxy");
    } else {
      i.parent.push({
        type: "effect",
        parent: proxy,
      })
    }
  });

  return proxy;
}