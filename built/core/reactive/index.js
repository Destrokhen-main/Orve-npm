"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ref = void 0;
var type_1 = require("../tsType/type");
var index_1 = require("../helper/index");
var ref = function (object, array) {
    if (array === void 0) { array = false; }
    var p = {
        parent: [],
        value: object,
    };
    if ((0, index_1.typeOf)(object) === "object" && !array) {
        console.warn("\u0432 ref object.\n \u0414\u043B\u044F \u0442\u0430\u043A\u0438\u0445 \u0441\u043B\u0443\u0447\u0430\u0435\u0432, \u043B\u0443\u0447\u0448\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C refO");
        return;
    }
    if ((0, index_1.typeOf)(object) === "array") {
        return object.map(function (e) {
            var type = (0, index_1.typeOf)(e);
            if (type !== "object" && type !== "proxy" && type !== "array")
                return (0, exports.ref)(e, true);
            else if (type === "proxy") {
                // TODO проверка на тип прокси
                // if (e.typeProxy)
            }
            else if (type === "array") {
                // array
            }
            else {
                // object
                return "not value";
            }
        });
    }
    return new Proxy(p, {
        get: function (target, prop) {
            if (prop === "type")
                return "proxy";
            if (prop === "typeProxy")
                return type_1.ProxyType.proxySimple;
            if (prop in target) {
                return target[prop];
            }
            else {
                return undefined;
            }
        },
        set: function (target, prop, value) {
            if (prop in target) {
                if (prop === "value") {
                    var parents = target.parent;
                    var before_1 = target[prop];
                    target[prop] = value;
                    parents.forEach(function (el) {
                        if (el.type === "child") {
                            if (el.value.nodeType === 3) {
                                el.value.nodeValue = value;
                            }
                        }
                        if (el.type === "props") {
                            if (value === "") {
                                el.value.removeAttribute(el.key);
                            }
                            else {
                                el.value.setAttribute(el.key, value);
                            }
                        }
                        if (el.type === "watch") {
                            el.function(value, before_1);
                        }
                        if (el.type === "effect") {
                            el.parent.refresh;
                        }
                        if (el.type === "refO") {
                            el.value.changed = true;
                        }
                    });
                }
                return true;
            }
            else {
                return false;
            }
        },
        deleteProperty: function (target, props) {
            return false;
        }
    });
};
exports.ref = ref;
//# sourceMappingURL=index.js.map