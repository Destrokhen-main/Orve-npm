"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorChild = exports.validateChildFunction = void 0;
var index_1 = require("../helper/index");
var error_1 = require("../error/error");
var errorMessage_js_1 = require("../error/errorMessage.js");
var SUPPORTED_CHILD_RESULT = ["string", "object", "array"];
var validateChildFunction = function (res, index) {
    var typeResult = (0, index_1.typeOf)(res);
    if (!SUPPORTED_CHILD_RESULT.includes(typeResult))
        (0, error_1.default)("".concat(res, " | \u043D\u043E\u043C\u0435\u0440 \u0432 \u043C\u0430\u0441\u0441\u0438\u0432\u0435: ").concat(index, " - ").concat(errorMessage_js_1.default.unsupportedTagC));
    return typeResult;
};
exports.validateChildFunction = validateChildFunction;
var SUPPORTED_TYPE_CHILDREN = ["function", "string", "proxy", "object", "number"];
var validatorChild = function (childs) {
    childs = childs.flat(1);
    if ((0, index_1.typeOf)(childs) !== "array") {
        (0, error_1.default)("".concat(childs, " - ").concat(errorMessage_js_1.default.childNotArray));
    }
    if (childs.length > 0) {
        childs.forEach(function (child) {
            if (!SUPPORTED_TYPE_CHILDREN.includes((0, index_1.typeOf)(child))) {
                (0, error_1.default)("".concat((0, index_1.typeOf)(child), " - ").concat(errorMessage_js_1.default.unsupportedTagC));
            }
        });
    }
};
exports.validatorChild = validatorChild;
//# sourceMappingURL=child.js.map