"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ref = void 0;
var type_1 = require("../tsType/type");
var index_1 = require("../helper/index");
var refO_1 = require("../refO");
var refA_1 = require("../refA");
var ref = function (object) {
    var type = (0, index_1.typeOf)(object);
    if (type === "object") {
        console.warn("\u0412\u044B \u043F\u044B\u0442\u0430\u043B\u0438\u0441\u044C \u0437\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 ref \u043E\u0431\u044A\u0435\u043A\u0442.\n\u041E\u0431\u044A\u0435\u043A\u0442 \u0431\u044B\u043B \u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0432 refO");
        return (0, refO_1.refO)(object);
    }
    if (type === "array") {
        console.warn("\u0412\u044B \u043F\u044B\u0442\u0430\u043B\u0438\u0441\u044C \u0437\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0432 ref \u043C\u0430\u0441\u0441\u0438\u0432.\n\u041E\u0431\u044A\u0435\u043A\u0442 \u0431\u044B\u043B \u043F\u0435\u0440\u0435\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0432 refA");
        return (0, refA_1.refA)(object);
    }
    var p = {
        parent: [],
        value: object,
    };
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