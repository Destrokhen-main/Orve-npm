"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../helper/index");
var index_2 = require("../linter/index");
var type_1 = require("../tsType/type");
var type_2 = require("../tsType/type");
var index_3 = require("../builder/index");
var recuriveFunction_1 = require("./recuriveFunction");
var recursiveChild = function (nodeProps, nodeChilds) {
    var _this = this;
    if (nodeProps === void 0) { nodeProps = null; }
    if (nodeChilds !== undefined &&
        (0, index_1.typeOf)(nodeChilds) === "array" &&
        nodeChilds.length > 0) {
        nodeChilds = nodeChilds.flat(1);
        return nodeChilds.map(function (child, index) {
            var typeChild = (0, index_1.typeOf)(child);
            if (typeChild === "string" && (child.includes("<") && child.includes(">") && (child.includes('</') || child.includes("/>")))) {
                return {
                    type: type_1.Type.HTMLCode,
                    value: child,
                };
            }
            if (typeChild === "string" || typeChild === "number") {
                return {
                    type: type_1.Type.NotMutable,
                    value: child
                };
            }
            if (typeChild === "object") {
                if (child["child"] !== undefined && (0, index_1.typeOf)(child["child"]) !== "array") {
                    child["child"] = [child["child"]];
                }
                (0, index_2.validatorTagNode)(child);
                if (typeof child["tag"] === "function") {
                    var nodeTag = recuriveFunction_1.default.bind(_this)(child);
                    if (nodeTag["child"] !== undefined) {
                        nodeTag["child"] = recursiveChild.bind(_this)(nodeTag["props"], nodeTag["child"]);
                    }
                    return {
                        type: type_1.Type.Layer,
                        value: nodeTag,
                        parent: child,
                    };
                }
                else {
                    if (child["child"] !== undefined) {
                        child["child"] = recursiveChild.bind(_this)(child["props"], child["child"]);
                    }
                }
                return {
                    type: type_1.Type.Component,
                    value: child,
                };
            }
            if (typeChild === "function") {
                var completeFunction = nodeProps !== undefined
                    ? child.bind(_this)(nodeProps)
                    : child.bind(_this)();
                var typeCompleteFunction = (0, index_1.typeOf)(completeFunction);
                (0, index_2.validateFunctionAnswer)(completeFunction, index);
                if (typeCompleteFunction === "object") {
                    if (completeFunction["child"] !== undefined && (0, index_1.typeOf)(completeFunction["child"]) !== "array") {
                        completeFunction["child"] = [completeFunction["child"]];
                    }
                    (0, index_2.validatorTagNode)(completeFunction);
                    if (typeof completeFunction["tag"] === "function") {
                        completeFunction = recuriveFunction_1.default.bind(_this)(completeFunction);
                        console.log(completeFunction);
                    }
                    if (completeFunction["child"] !== undefined) {
                        completeFunction["child"] = recursiveChild.bind(_this)(completeFunction["props"], completeFunction["child"]);
                    }
                    return {
                        type: type_1.Type.ComponentMutable,
                        value: completeFunction,
                        function: child,
                    };
                }
                if (typeCompleteFunction === "string" || typeCompleteFunction === "number") {
                    return {
                        type: type_1.Type.Mutable,
                        value: completeFunction,
                        function: child,
                    };
                }
            }
            if (typeChild === "proxy") {
                var typeProxy = child.typeProxy;
                if (typeProxy === type_2.ProxyType.proxySimple) {
                    return {
                        type: type_1.Type.Proxy,
                        value: child.value,
                        proxy: child
                    };
                }
                if (typeProxy === type_2.ProxyType.proxyComponent) {
                    var result = index_3.builder.bind(_this)(child.value);
                    if (typeof result["tag"] === "function") {
                        result = recuriveFunction_1.default.bind(_this)(result);
                    }
                    return {
                        type: type_1.Type.ProxyComponent,
                        value: result,
                        proxy: child
                    };
                }
                if (typeProxy === type_2.ProxyType.proxyEffect) {
                    return {
                        type: type_1.Type.ProxyEffect,
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
//# sourceMappingURL=children.js.map