"use strict";
// return object.map((e: number | string | object) => {
//   const type = typeOf(e);
//   if (type !== "function" && type !== "proxy") {
//     return ref(e);
//   } else {
//     return e;
//   }
// })
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refA = void 0;
var type_1 = require("../tsType/type");
var cOrr = ['push', 'pop', 'shift', 'unshift', 'splice'];
function createArrayProxy(ar) {
    var handler = {};
    cOrr.forEach(function (key) {
        handler[key] = function () {
            var args = [];
            for (var i = 0; i !== arguments.length; i++) {
                args.push(arguments[i]);
            }
            Array.prototype[key].apply(this, args);
            ar.forEach(function (e) {
                e.parent.refresh;
            });
        };
    });
    return handler;
}
var valueCreator = function (obj) {
    var parent = this.parent;
    var arPr = createArrayProxy(parent);
    return new Proxy(obj, {
        get: function (target, props, receive) {
            if (arPr[props] !== undefined) {
                return Reflect.get(__assign({ target: target }, arPr), props, receive);
            }
            return target[props];
        },
    });
};
var refA = function (obj) {
    var proxy = {
        parent: [],
        value: valueCreator,
        type: "proxy",
        typeProxy: type_1.ProxyType.proxyArray,
    };
    proxy.value = proxy.value(obj);
    return proxy;
};
exports.refA = refA;
//# sourceMappingURL=index.js.map