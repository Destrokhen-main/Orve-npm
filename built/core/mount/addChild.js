"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChild = void 0;
var type_1 = require("../tsType/type");
var ProxyEffect_1 = require("./partMount/ProxyEffect");
var addChild = function (app, child, callback) {
    return child.map(function (ch) {
        if (ch.type === type_1.Type.HTMLCode) {
            app.innerHTML += ch.value;
            return ch;
        }
        if (ch.type === type_1.Type.NotMutable) {
            var el = document.createTextNode(ch.value);
            app.appendChild(el);
            return ch;
        }
        if (ch.type === type_1.Type.Component ||
            ch.type === type_1.Type.ComponentMutable ||
            ch.type === type_1.Type.Layer) {
            return callback(app, ch.value);
        }
        if (ch.type === type_1.Type.Proxy) {
            var el = document.createTextNode(ch.value);
            ch.node = el;
            ch.proxy.parent.push({
                type: "child",
                value: el,
            });
            app.appendChild(el);
            return ch;
        }
        if (ch.type === type_1.Type.ProxyComponent) {
            var el = callback(app, ch.value);
            ch.proxy.parent.push(el.node);
            return el;
        }
        if (ch.type === type_1.Type.ProxyEffect) {
            return (0, ProxyEffect_1.default)(app, ch, callback);
        }
    });
};
exports.addChild = addChild;
