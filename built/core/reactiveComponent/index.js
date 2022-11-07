"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refC = void 0;
var type_1 = require("../tsType/type");
var index_1 = require("../builder/index");
var rebiuld_1 = require("../mount/rebiuld");
var index_2 = require("../helper/index");
var refC = function (component) {
    var comp = component;
    var type = (0, index_2.typeOf)(component);
    if (type !== "function") {
        if (type === "object") {
            comp = function () { return component; };
        }
    }
    var object = {
        parent: [],
        value: comp,
    };
    return new Proxy(object, {
        get: function (target, prop) {
            if (prop === "type") {
                return "proxy";
            }
            if (prop === "typeProxy") {
                return type_1.ProxyType.proxyComponent;
            }
            if (prop in target) {
                return target[prop];
            }
        },
        set: function (target, prop, value) {
            if (prop in target) {
                var comp_1 = value;
                if (prop === "value") {
                    var type_2 = (0, index_2.typeOf)(component);
                    if (type_2 !== "function") {
                        if (type_2 === "object") {
                            comp_1 = function () { return value; };
                        }
                    }
                }
                target[prop] = value;
                if (prop === "value") {
                    if (target.parent.length > 0) {
                        var newObj = index_1.builder.bind(window.sReact.sReactContext)(comp_1);
                        var object_1 = (0, rebiuld_1.createNodeRebuild)(null, newObj);
                        target.parent = target.parent.map(function (el) {
                            if (el.type === undefined) {
                                el.replaceWith(object_1);
                                return object_1;
                            }
                            else if (el.type === "effect") {
                                el.parent.refresh;
                                return el;
                            }
                        });
                    }
                }
                return true;
            }
            return false;
        },
        deleteProperty: function () {
            return false;
        }
    });
};
exports.refC = refC;
//# sourceMappingURL=index.js.map