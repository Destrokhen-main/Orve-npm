var typeOf = require("../helper/index.js").typeOf;
var error = require("../error/error.js");
var errorMessage = require("../error/errorMessage.js");
var _a = require("./props.js"), validatorProps = _a.validatorProps, validSingleProps = _a.validSingleProps;
var _b = require("./child.js"), validateChildFunction = _b.validateChildFunction, validatorChild = _b.validatorChild;
var SUPPORTED_VARIABLES = ["tag", "props", "child"];
var validatorMainNode = function (node) {
    // check unsupported object variables
    Object.keys(node).forEach(function (key) {
        if (!SUPPORTED_VARIABLES.includes(key))
            error("".concat(key, " - ").concat(errorMessage.useUnsupportedVariables));
    });
    var tag = node.tag, props = node.props, child = node.child;
    // check exist tag
    if (tag === undefined)
        error(errorMessage.missTagOnObject);
    if (props !== undefined)
        validatorProps(props);
    if (child !== undefined) {
        if (Array.isArray(child))
            validatorChild(child);
        else
            error("Child \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u0438\u043F\u0430 array");
    }
};
var CORRECT_ANSWER = ["array", "string", "object", "number", "proxy"];
var validateFunctionAnswer = function (res, index) {
    if (res === undefined)
        error("".concat(res, " | \u043D\u043E\u043C\u0435\u0440 \u0432 \u043C\u0430\u0441\u0441\u0438\u0432\u0435: ").concat(index, " - ").concat(errorMessage.functionReturnUndefinedOrNull));
    var type = typeOf(res);
    if (!CORRECT_ANSWER.includes(type))
        error("".concat(res, " | \u043D\u043E\u043C\u0435\u0440 \u0432 \u043C\u0430\u0441\u0441\u0438\u0432\u0435: ").concat(index, " - ").concat(errorMessage.functionReturnIncorrectData));
};
var TAG_TYPE_NODE = ["string", "function"];
var validatorTagNode = function (node) {
    Object.keys(node).forEach(function (key) {
        if (!SUPPORTED_VARIABLES.includes(key))
            error("".concat(key, " - ").concat(errorMessage.useUnsupportedVariables));
    });
    var tag = node.tag, props = node.props, child = node.child;
    // check exist tag
    if (tag === undefined)
        error(errorMessage.missTagOnObject);
    if (!TAG_TYPE_NODE.includes(typeOf(tag)))
        error("".concat(JSON.stringify(node), " - ").concat(errorMessage.unsupportedTag));
    if (props !== undefined)
        validatorProps(props);
    if (child !== undefined) {
        if (child !== undefined) {
            if (Array.isArray(child))
                validatorChild(child);
            else
                error("Child \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u0438\u043F\u0430 array");
        }
    }
};
module.exports = {
    validatorMainNode: validatorMainNode,
    validateChildFunction: validateChildFunction,
    validatorTagNode: validatorTagNode,
    validSingleProps: validSingleProps,
    validateFunctionAnswer: validateFunctionAnswer
};
