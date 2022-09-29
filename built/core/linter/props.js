var typeOf = require("../helper/index.js").typeOf;
var SUPPORTED_TYPE_PROPS = ["function", "string", "proxy", "number", "object", "array"];
var CORRECT_PROPS_FUNCTION = ["string", "proxy", "number"];
var error = require("../error/error.js");
var errorMessage = require("../error/errorMessage.js");
var validatorProps = function (props) {
    if (typeOf(props) !== "object")
        error(errorMessage.propsNotAObject);
    // check all variables in object props
    Object.keys(props).forEach(function (key) {
        var value = props[key];
        // this is event function
        if (key.startsWith("@")) {
            if (typeOf(value) !== "function")
                error("".concat(key, " - ").concat(errorMessage.eventNotAFunction));
        }
        if (typeOf(value) === "object") {
            if (key === "src") {
                if (value["__esModule"] !== undefined && value["default"] === undefined)
                    error("".concat(key, " - ").concat(errorMessage.incorrectPropsValue));
            }
        }
        else if (!SUPPORTED_TYPE_PROPS.includes(typeOf(value))) {
            error("".concat(key, " \u0432\u044B\u0434\u0430\u043B ").concat(value, " - ").concat(errorMessage.incorrectPropsValue));
        }
    });
};
var validSingleProps = function (prop, pr) {
    if (!CORRECT_PROPS_FUNCTION.includes(typeOf(prop)))
        error("".concat(pr, " - ").concat(errorMessage.incorrectPropsValue));
};
module.exports = {
    validatorProps: validatorProps,
    validSingleProps: validSingleProps
};
