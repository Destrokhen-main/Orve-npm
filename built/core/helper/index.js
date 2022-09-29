"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOf = exports.isProxy = void 0;
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
