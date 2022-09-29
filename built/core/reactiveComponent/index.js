var Type = require("../type/proxy.js");
var builder = require("../builder/index.js");
var createNodeRebuild = require("../mount/rebiuld.js").createNodeRebuild;
var typeOf = require("../helper/index.js").typeOf;
module.exports.refC = function (component) {
    var comp = component;
    var type = typeOf(component);
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
            if (prop === "type")
                return "proxy";
            if (prop === "typeProxy")
                return Type.proxyComponent;
            if (prop in target) {
                return target[prop];
            }
        },
        set: function (target, prop, value) {
            if (prop in target) {
                var comp_1 = value;
                if (prop === "value") {
                    var type_1 = typeOf(component);
                    if (type_1 !== "function") {
                        if (type_1 === "object") {
                            comp_1 = function () { return value; };
                        }
                    }
                }
                target[prop] = value;
                if (prop === "value") {
                    if (target.parent.length > 0) {
                        var newObj = builder(comp_1);
                        var object_1 = createNodeRebuild(null, newObj);
                        target.parent = target.parent.map(function (el) {
                            el.insertAdjacentElement('afterend', object_1);
                            el.remove();
                            return object_1;
                        });
                    }
                }
                return true;
            }
            return false;
        }
    });
};
