var Type = require("../type/proxy.js");
module.exports.ref = function (object) {
    var p = {
        parent: [],
        value: object,
    };
    return new Proxy(p, {
        get: function (target, prop) {
            if (prop === "type")
                return "proxy";
            if (prop === "typeProxy")
                return Type.proxySimple;
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
                            el.value.setAttribute(el.key, value);
                        }
                        if (el.type === "watch") {
                            el.function(value, before_1);
                        }
                        if (el.type === "effect") {
                            el.parent.refresh;
                        }
                    });
                }
                return true;
            }
            else {
                return false;
            }
        }
    });
};
