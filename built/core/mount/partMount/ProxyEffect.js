"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../helper/index");
function default_1(app, ch, callback) {
    var type = (0, index_1.typeOf)(ch.value);
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
        // NOTE need valid
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
exports.default = default_1;
