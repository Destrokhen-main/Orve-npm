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
var index_1 = require("../helper/index");
function valid(str) {
    return Object.keys(type_1.ProxyType).some(function (e) {
        return type_1.ProxyType[e] === str;
    });
}
var changes = function (target, value) {
    if (target["parent"].length > 0) {
        target["parent"].forEach(function (e) {
            if (e.type === "watch") {
                e.function(value, null);
            }
            if (e.type === "effect") {
                e.parent.refresh;
            }
            if (e.type === "refO") {
                e.parent.changed = true;
            }
        });
    }
    return true;
};
var created = function (target, props, value, proxy) {
    if (typeof value !== "object") {
        var r = (0, reactive_1.ref)(value);
        r.parent.push({
            type: "refO",
            value: proxy
        });
        target[props] = r;
        changes(target, props);
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
            return changes(target, props);
        }
        else if (value.type === "proxy") {
            if (valid(value.typeProxy)) {
                value.parent.push({
                    type: "refO",
                    value: proxy
                });
                target[props] = value;
                changes(target, props);
                return true;
            }
            else {
                (0, error_1.default)("Вы пытаетесь прокинуть не reactive orve");
                return false;
            }
        }
        else {
            var r = refO(value);
            r.parent.push({
                type: "refO",
                value: proxy
            });
            target[props] = r;
            changes(target, props);
            return true;
        }
    }
};
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
                return changes(target, props);
            }
            if (props in target) {
                if ((0, index_1.typeOf)(target[props].value) !== (0, index_1.typeOf)(value)) {
                    created(target, props, value, proxy);
                }
                else {
                    target[props].value = value;
                }
                return changes(target, props);
            }
            if (typeof value !== "object") {
                var r = (0, reactive_1.ref)(value);
                r.parent.push({
                    type: "refO",
                    value: proxy
                });
                target[props] = r;
                return changes(target, props);
            }
            else {
                return created(target, props, value, proxy);
            }
        },
        deleteProperty: function (target, props) {
            if (props !== "parent") {
                if (props in target) {
                    delete target[props];
                    return changes(target, props);
                }
            }
            return false;
        }
    });
    Object.keys(object).forEach(function (e) {
        proxy[e] = object[e];
    });
    return proxy;
};
exports.refO = refO;
//# sourceMappingURL=index.js.map