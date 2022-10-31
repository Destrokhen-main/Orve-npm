"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObjectContext = exports.typeOf = exports.isProxy = void 0;
var isProxy = function (obj) {
    return obj.type === "proxy" ? true : false;
};
exports.isProxy = isProxy;
var typeOf = function (obj) {
    var type = typeof obj;
    if (type === "object") {
        if (isProxy(obj)) {
            return "proxy";
        }
        else if (Array.isArray(obj)) {
            return "array";
        }
        return "object";
    }
    return type;
};
exports.typeOf = typeOf;
var createObjectContext = function (app) {
    var Context = {};
    Object.keys(app).forEach(function (e) {
        Object.keys(app[e]).forEach(function (l) {
            if (l.startsWith("$"))
                Context[l] = app[e][l];
            else
                Context["$".concat(l)] = app[e][l];
        });
    });
    return Context;
};
exports.createObjectContext = createObjectContext;
//# sourceMappingURL=index.js.map