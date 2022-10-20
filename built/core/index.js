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
exports.context = exports.createApp = void 0;
var index_1 = require("./builder/index");
var index_2 = require("./mount/index");
var helper_1 = require("./helper");
var Context = null;
var createApp = function (_a) {
    var App = _a.App, all = __rest(_a, ["App"]);
    Context = (0, helper_1.createObjectContext)(all);
    window.sReact = {
        sReactContext: Context,
        sReactDOM: index_1.builder.bind(Context)(App)
    };
    return {
        mount: function (query) {
            window.sReact.sReactDOM = (0, index_2.mount)(query);
        }
    };
};
exports.createApp = createApp;
var context = function () {
    if (window.sReact !== undefined && window.sReact.sReactContext !== undefined) {
        return window.sReact.sReactContext;
    }
    else {
        return Context;
    }
};
exports.context = context;
