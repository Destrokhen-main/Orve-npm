var typeOf = require("../helper/index.js").typeOf;
var error = require("../error/error.js");
var errorMessage = require("../error/errorMessage.js");
var SUPPORTED_CHILD_RESULT = ["string", "object", "array"];
var validateChildFunction = function (res, index) {
    var typeResult = typeOf(res);
    if (!SUPPORTED_CHILD_RESULT.includes(typeResult))
        error("".concat(res, " | \u043D\u043E\u043C\u0435\u0440 \u0432 \u043C\u0430\u0441\u0441\u0438\u0432\u0435: ").concat(index, " - ").concat(errorMessage.unsupportedTagC));
    return typeResult;
};
var SUPPORTED_TYPE_CHILDREN = ["function", "string", "proxy", "object", "number"];
var validatorChild = function (childs) {
    childs = childs.flat(1);
    if (typeOf(childs) !== "array")
        error("".concat(childs, " - ").concat(errorMessage.childNotArray));
    if (childs.length > 0)
        childs.forEach(function (child) {
            if (!SUPPORTED_TYPE_CHILDREN.includes(typeOf(child)))
                error("".concat(typeOf(child), " - ").concat(errorMessage.unsupportedTagC));
        });
};
module.exports = {
    validateChildFunction: validateChildFunction,
    validatorChild: validatorChild
};
