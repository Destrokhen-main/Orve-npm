var error = require("../error/error.js");
var typeOf = require("../helper/index.js").typeOf;
var Type = require("../type/proxy.js");
module.exports.effect = function (callback, dependency) {
    if (dependency === void 0) { dependency = []; }
    if (typeof callback !== "function") {
        error("\u041F\u0435\u0440\u0432\u044B\u043C \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043E\u043C \u0434\u043E\u043B\u0436\u043D\u0430 \u0438\u0434\u0442\u0438 \u0444\u0443\u043D\u043A\u0446\u0438\u044F");
    }
    if (Array.isArray(dependency) !== true) {
        error("Зависимости могут быть только в массиве");
    }
    var object = {
        parent: [],
        value: callback(),
        function: callback
    };
    var proxy = new Proxy(object, {
        get: function (target, prop) {
            if (prop === "type")
                return "proxy";
            if (prop === "typeProxy")
                return Type.proxyEffect;
            if (prop === "refresh") {
                var newFunction_1 = target["function"]();
                if (target.parent.length > 0) {
                    target.parent.forEach(function (p) {
                        // string | object | function
                        // string
                        if (p.type === "child") {
                            if (p.type === "child") {
                                if (p.value.nodeType === 3) {
                                    p.value.nodeValue = newFunction_1;
                                }
                            }
                        }
                        if (p.type === "props") {
                            p.value.setAttribute(p.key, newFunction_1);
                        }
                        if (p.type === "watch") {
                            p.function(newFunction_1, target["value"]);
                        }
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
        var type = typeOf(i);
        if (type !== "proxy") {
            error("Вы попытались засунуть в зависимости не proxy");
        }
        else {
            i.parent.push({
                type: "effect",
                parent: proxy,
            });
        }
    });
    return proxy;
};
