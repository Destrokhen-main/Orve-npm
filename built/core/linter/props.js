"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validSingleProps = exports.validatorProps = void 0;
var index_js_1 = require("../helper/index.js");
var SUPPORTED_TYPE_PROPS = ["function", "string", "proxy", "number", "object", "array"];
var CORRECT_PROPS_FUNCTION = ["string", "proxy", "number"];
var error_1 = require("../error/error");
var errorMessage_1 = require("../error/errorMessage");
var validatorProps = function (props) {
    if ((0, index_js_1.typeOf)(props) !== "object") {
        (0, error_1.default)(errorMessage_1.default.propsNotAObject);
    }
    // check all variables in object props
    Object.keys(props).forEach(function (key) {
        var value = props[key];
        // this is event function
        if (key.startsWith("@")) {
            if ((0, index_js_1.typeOf)(value) !== "function") {
                (0, error_1.default)("".concat(key, " - ").concat(errorMessage_1.default.eventNotAFunction));
            }
        }
        if ((0, index_js_1.typeOf)(value) === "object") {
            if (key === "src") {
                if (value["__esModule"] !== undefined && value["default"] === undefined) {
                    (0, error_1.default)("".concat(key, " - ").concat(errorMessage_1.default.incorrectPropsValue));
                }
            }
        }
        else if (!SUPPORTED_TYPE_PROPS.includes((0, index_js_1.typeOf)(value))) {
            (0, error_1.default)("".concat(key, " \u0432\u044B\u0434\u0430\u043B ").concat(value, " - ").concat(errorMessage_1.default.incorrectPropsValue));
        }
    });
};
exports.validatorProps = validatorProps;
var validSingleProps = function (prop, pr) {
    if (!CORRECT_PROPS_FUNCTION.includes((0, index_js_1.typeOf)(prop)))
        (0, error_1.default)("".concat(pr, " - ").concat(errorMessage_1.default.incorrectPropsValue));
};
exports.validSingleProps = validSingleProps;
//# sourceMappingURL=props.js.map