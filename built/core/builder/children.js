"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeOf = require("../helper/index.js").typeOf;
var _a = require("../linter/index.js"), validatorTagNode = _a.validatorTagNode, validateFunctionAnswer = _a.validateFunctionAnswer;
var Type = require("./type.js");
var error = require("../error/error.js");
var TYPE_MESSAGE = require("../error/errorMessage.js");
var TypeProxy = require("../type/proxy.js");
var HTML_TAG = ["br", "hr"];
var recursiveCheckFunctionAnswer = function (node) {
    var haveDop = false;
    var functionObject = {};
    if (node["props"] !== undefined) {
        functionObject = __assign({}, node["props"]);
        haveDop = true;
    }
    if (node["child"] !== undefined) {
        functionObject["children"] = node['child'];
        haveDop = true;
    }
    var completeFunction = haveDop ? node["tag"](__assign({}, functionObject)) : node["tag"]();
    var typeCompleteFunction = typeOf(completeFunction);
    if (typeCompleteFunction !== "object") {
        error("index in array ".concat(index, " - ").concat(TYPE_MESSAGE.functionInTagReturn));
    }
    if (typeof completeFunction["tag"] === "function") {
        return recursiveCheckFunctionAnswer(completeFunction);
    }
    return completeFunction;
};
var recursiveChild = function (nodeProps, nodeChilds) {
    if (nodeProps === void 0) { nodeProps = null; }
    if (nodeChilds !== undefined &&
        typeOf(nodeChilds) === "array" &&
        nodeChilds.length > 0) {
        nodeChilds = nodeChilds.flat();
        return nodeChilds.map(function (child, index) {
            var typeChild = typeOf(child);
            if (typeChild === "string") {
                if (child.startsWith("<") && child.endsWith(">")) {
                    var parsedTag = child.replace(/[<,>,\/]/gm, "").trim();
                    if (HTML_TAG.includes(parsedTag)) {
                        return {
                            type: Type.Component,
                            value: {
                                tag: parsedTag,
                            }
                        };
                    }
                }
                else if (child.startsWith("<") && !child.endsWith(">") ||
                    !child.startsWith("<") && child.endsWith(">")) {
                    error("".concat(child, " - \u043D\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \"<\",\">\" \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E \u0432 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435"));
                }
            }
            if (typeChild === "string" || typeChild === "number") {
                return {
                    type: Type.NotMutable,
                    value: child
                };
            }
            if (typeChild === "object") {
                validatorTagNode(child);
                if (typeof child["tag"] === "function") {
                    var haveDop = false;
                    var functionObject = {};
                    if (child["props"] !== undefined) {
                        functionObject = __assign({}, child["props"]);
                        haveDop = true;
                    }
                    if (child["child"] !== undefined) {
                        functionObject["children"] = child['child'];
                        haveDop = true;
                    }
                    var completeFunction = haveDop ? child["tag"](__assign({}, functionObject)) : child["tag"]();
                    var typeCompleteFunction = typeOf(completeFunction);
                    if (typeCompleteFunction !== "object") {
                        error("index in array ".concat(index, " - ").concat(TYPE_MESSAGE.functionInTagReturn));
                    }
                    validatorTagNode(completeFunction);
                    if (typeof completeFunction["tag"] === "function") {
                        completeFunction = recursiveCheckFunctionAnswer(completeFunction);
                    }
                    if (completeFunction["child"] !== undefined)
                        completeFunction["child"] = recursiveChild(completeFunction["props"], completeFunction["child"]);
                    return {
                        type: Type.Component,
                        value: completeFunction,
                    };
                }
                else {
                    if (child["child"] !== undefined)
                        child["child"] = recursiveChild(child["props"], child["child"]);
                }
                return {
                    type: Type.Component,
                    value: child,
                };
            }
            if (typeChild === "function") {
                var completeFunction = nodeProps !== undefined ? child(nodeProps) : child();
                var typeCompleteFunction = typeOf(completeFunction);
                validateFunctionAnswer(completeFunction, index);
                if (typeCompleteFunction === "object") {
                    validatorTagNode(completeFunction);
                    if (typeof completeFunction["tag"] === "function") {
                        completeFunction = recursiveCheckFunctionAnswer(completeFunction);
                    }
                    if (completeFunction["child"] !== undefined)
                        completeFunction["child"] = recursiveChild(completeFunction["props"], completeFunction["child"]);
                    return {
                        type: Type.ComponentMutable,
                        value: completeFunction,
                        function: child,
                    };
                }
                if (typeCompleteFunction === "string" || typeCompleteFunction === "number") {
                    return {
                        type: Type.Mutable,
                        value: completeFunction,
                        function: child,
                    };
                }
            }
            if (typeChild === "proxy") {
                var typeProxy = child.typeProxy;
                if (typeProxy === TypeProxy.proxySimple) {
                    return {
                        type: Type.Proxy,
                        value: child.value,
                        proxy: child
                    };
                }
                if (typeProxy === TypeProxy.proxyComponent) {
                    var builder = require("../builder/index.js");
                    var result = builder(child.value);
                    if (typeof result["tag"] === "function") {
                        result = recursiveCheckFunctionAnswer(result);
                    }
                    return {
                        type: Type.ProxyComponent,
                        value: result,
                        proxy: child
                    };
                }
                if (typeProxy === TypeProxy.proxyEffect) {
                    return {
                        type: Type.ProxyEffect,
                        value: child.value,
                        proxy: child
                    };
                }
            }
        });
    }
    else {
        return [];
    }
};
exports.default = recursiveChild;
