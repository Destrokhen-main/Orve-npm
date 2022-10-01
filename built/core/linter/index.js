"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFunctionAnswer = exports.validSingleProps = exports.validatorTagNode = exports.validateChildFunction = exports.validatorMainNode = void 0;
var index_1 = require("../helper/index");
var error_1 = require("../error/error");
var errorMessage_1 = require("../error/errorMessage");
var props_1 = require("./props");
Object.defineProperty(exports, "validSingleProps", { enumerable: true, get: function () { return props_1.validSingleProps; } });
var child_1 = require("./child");
Object.defineProperty(exports, "validateChildFunction", { enumerable: true, get: function () { return child_1.validateChildFunction; } });
var SUPPORTED_VARIABLES = ["tag", "props", "child"];
var validatorMainNode = function (node) {
    // check unsupported object variables
    Object.keys(node).forEach(function (key) {
        if (!SUPPORTED_VARIABLES.includes(key))
            (0, error_1.default)("".concat(key, " - ").concat(errorMessage_1.default.useUnsupportedVariables));
    });
    var tag = node.tag, props = node.props, child = node.child;
    // check exist tag
    if (tag === undefined)
        (0, error_1.default)(errorMessage_1.default.missTagOnObject);
    if (props !== undefined)
        (0, props_1.validatorProps)(props);
    if (child !== undefined) {
        if (Array.isArray(child))
            (0, child_1.validatorChild)(child);
        else
            (0, error_1.default)("Child \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u0438\u043F\u0430 array");
    }
};
exports.validatorMainNode = validatorMainNode;
var CORRECT_ANSWER = ["array", "string", "object", "number", "proxy"];
var validateFunctionAnswer = function (res, index) {
    if (res === undefined)
        (0, error_1.default)("".concat(res, " | \u043D\u043E\u043C\u0435\u0440 \u0432 \u043C\u0430\u0441\u0441\u0438\u0432\u0435: ").concat(index, " - ").concat(errorMessage_1.default.functionReturnUndefinedOrNull));
    var type = (0, index_1.typeOf)(res);
    if (!CORRECT_ANSWER.includes(type))
        (0, error_1.default)("".concat(res, " | \u043D\u043E\u043C\u0435\u0440 \u0432 \u043C\u0430\u0441\u0441\u0438\u0432\u0435: ").concat(index, " - ").concat(errorMessage_1.default.functionReturnIncorrectData));
};
exports.validateFunctionAnswer = validateFunctionAnswer;
var TAG_TYPE_NODE = ["string", "function"];
var validatorTagNode = function (node) {
    Object.keys(node).forEach(function (key) {
        if (!SUPPORTED_VARIABLES.includes(key))
            (0, error_1.default)("".concat(key, " - ").concat(errorMessage_1.default.useUnsupportedVariables));
    });
    var tag = node.tag, props = node.props, child = node.child;
    // check exist tag
    if (tag === undefined)
        (0, error_1.default)(errorMessage_1.default.missTagOnObject);
    if (!TAG_TYPE_NODE.includes((0, index_1.typeOf)(tag)))
        (0, error_1.default)("".concat(JSON.stringify(node), " - ").concat(errorMessage_1.default.unsupportedTag));
    if (props !== undefined)
        (0, props_1.validatorProps)(props);
    if (child !== undefined) {
        if (child !== undefined) {
            if (Array.isArray(child))
                (0, child_1.validatorChild)(child);
            else
                (0, error_1.default)("Child \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u0438\u043F\u0430 array");
        }
    }
};
exports.validatorTagNode = validatorTagNode;
