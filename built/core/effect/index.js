"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.effect = void 0;
var error_js_1 = require("../error/error.js");
var index_js_1 = require("../helper/index.js");
var type_1 = require("../tsType/type");
var effect_1 = require("../error/effect");
function effect(callback, dependency) {
    if (dependency === void 0) { dependency = []; }
    if (typeof callback !== "function") {
        (0, error_js_1.default)(effect_1.default.NEED_FINCTION);
    }
    if (Array.isArray(dependency) !== true) {
        (0, error_js_1.default)(effect_1.default.DEP_NEED_ARRAY);
    }
    var cb = callback();
    var object = {
        parent: [],
        value: cb,
        function: callback,
        lastCall: cb
    };
    var proxy = new Proxy(object, {
        get: function (target, prop) {
            if (prop === "type") {
                return "proxy";
            }
            if (prop === "typeProxy") {
                return type_1.ProxyType.proxyEffect;
            }
            if (prop === "refresh") {
                var newFunction_1 = target["function"]();
                if (target.parent.length > 0) {
                    target.parent.forEach(function (p) {
                        // string | object | function
                        // string
                        if (p.type === "child") {
                            if (p.value.nodeType === 3) {
                                p.value.nodeValue = newFunction_1;
                            }
                        }
                        if (p.type === "props") {
                            if (newFunction_1 === "") {
                                p.value.removeAttribute(p.key);
                            }
                            else {
                                p.value.setAttribute(p.key, newFunction_1);
                            }
                        }
                        if (p.type === "watch") {
                            p.function(newFunction_1, target["value"]);
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
        set: function (target, prop, value) {
            if (prop === "function" || prop === "value")
                return false;
            if (prop in target) {
                target[prop] = value;
                return true;
            }
            else {
                return false;
            }
        }
    });
    dependency.forEach(function (i) {
        var type = (0, index_js_1.typeOf)(i);
        if (type !== "proxy") {
            (0, error_js_1.default)(effect_1.default.ONLY_PROXY);
        }
        else {
            i.parent.push({
                type: "effect",
                parent: proxy,
            });
        }
    });
    return proxy;
}
exports.effect = effect;
//# sourceMappingURL=index.js.map