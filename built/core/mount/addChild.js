var Type = require("../builder/type.js");
var typeOf = require("../helper/index.js").typeOf;
module.exports.addChild = function (app, child, callback) {
    return child.map(function (ch) {
        if (ch.type === Type.NotMutable) {
            var el = document.createTextNode(ch.value);
            app.appendChild(el);
            return ch;
        }
        if (ch.type === Type.Component || ch.type === Type.ComponentMutable) {
            return callback(app, ch.value);
        }
        if (ch.type === Type.Proxy) {
            var el = document.createTextNode(ch.value);
            ch.node = el;
            ch.proxy.parent.push({
                type: "child",
                value: el,
            });
            app.appendChild(el);
            return ch;
        }
        if (ch.type === Type.ProxyComponent) {
            var el = callback(app, ch.value);
            ch.proxy.parent.push(el.node);
            return el;
        }
        if (ch.type === Type.ProxyEffect) {
            var type = typeOf(ch.value);
            if (type === "string" || type === "number") {
                var el = document.createTextNode(ch.value);
                ch.node = el;
                ch.proxy.parent.push({
                    type: "child",
                    value: el,
                });
                app.appendChild(el);
                return ch;
            }
            else if (type === "object") {
                // NOTE mb need valid
                var el = callback(app, ch.value);
                ch.proxy.parent.push({
                    type: "component",
                    value: el
                });
                return el;
            }
            else if (type === "proxy") {
                console.log("proxy");
            }
        }
    });
};
