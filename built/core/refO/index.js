"use strict";
/*
  {
    [key]: proxy({ value: "", parent: []}),
    parent: []
  }
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.refO = void 0;
var type_1 = require("../tsType/type");
var reactive_1 = require("../reactive");
var error_1 = require("../error/error");
function valid(str) {
    return Object.keys(type_1.ProxyType).some(function (e) {
        return type_1.ProxyType[e] === str;
    });
}
var refO = function (object) {
    var pr = {
        parent: [],
    };
    var proxy = new Proxy(pr, {
        get: function (target, props) {
            if (props === "type")
                return "proxy";
            if (props === "typeProxy")
                return type_1.ProxyType.proxyObject;
            return target[props];
        },
        set: function (target, props, value) {
            if (props === "changed") {
                if (target["parent"].length > 0) {
                    target["parent"].forEach(function (e) {
                        if (e.type === "watch") {
                            e.function(value, null);
                        }
                        if (e.type === "effect") {
                            e.parent.refresh;
                        }
                    });
                }
                return true;
            }
            if (typeof value !== "object") {
                var r = (0, reactive_1.ref)(value);
                r.parent.push({
                    type: "refO",
                    value: proxy
                });
                target[props] = r;
                return true;
            }
            else {
                if (Array.isArray(value)) {
                    var r = (0, reactive_1.ref)(value);
                    r.parent.push({
                        type: "refO",
                        value: proxy
                    });
                    target[props] = r;
                    return true;
                }
                else if (value.type === "proxy") {
                    if (valid(value.typeProxy)) {
                        value.parent.push({
                            type: "refO",
                            value: proxy
                        });
                        target[props] = value;
                        return true;
                    }
                    else {
                        (0, error_1.default)("Вы пытаетесь прокинуть proxy не orve");
                        return false;
                    }
                }
            }
            target[props] = value;
            return true;
        }
    });
    Object.keys(object).forEach(function (e) {
        proxy[e] = object[e];
    });
    console.log(proxy);
    return proxy;
};
exports.refO = refO;
//# sourceMappingURL=index.js.map