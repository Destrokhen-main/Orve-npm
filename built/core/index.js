"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./builder/index");
var index_2 = require("./mount/index");
function default_1(_a) {
    var App = _a.App, app = __rest(_a, ["App"]);
    var Context = {};
    Object.keys(app).forEach(function (e) {
        Object.keys(app[e]).forEach(function (l) {
            if (l.startsWith("$"))
                Context[l] = app[e][l];
            else
                Context["$".concat(l)] = app[e][l];
        });
    });
    window.sReactContext = Context;
    window.sReactDOM = index_1.builder.bind(Context)(App);
    return {
        mount: function (query) {
            window.sReactDOM = (0, index_2.default)(query);
        }
    };
}
exports.default = default_1;
;
