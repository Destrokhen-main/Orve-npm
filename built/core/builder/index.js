"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = void 0;
var errorMessage_1 = require("../error/errorMessage");
var error_1 = require("../error/error");
var index_1 = require("../linter/index");
var index_2 = require("../helper/index");
var type_1 = require("../tsType/type");
var children_1 = require("./children");
var recuriveFunction_1 = require("./recuriveFunction");
var builder = function (app) {
    if ((0, index_2.typeOf)(app) !== "function") {
        (0, error_1.default)("".concat(app, " - ").concat(errorMessage_1.default.appNotAFunction));
    }
    var mainNode = app.bind(this)();
    if ((0, index_2.typeOf)(mainNode) !== "object") {
        (0, error_1.default)("".concat(mainNode, " - ").concat(errorMessage_1.default.resultCallNotAObject));
    }
    if (mainNode["child"] !== undefined && (0, index_2.typeOf)(mainNode["child"]) !== "array") {
        mainNode["child"] = [mainNode["child"]];
    }
    // check mainNode
    (0, index_1.validatorMainNode)(mainNode);
    // if tag have function
    if (typeof mainNode["tag"] === "function") {
        mainNode = recuriveFunction_1.default.bind(this)(mainNode);
    }
    mainNode["type"] = type_1.Type.Component;
    if (mainNode["child"] !== undefined) {
        mainNode["child"] = children_1.default.bind(this)(mainNode["props"], mainNode["child"]);
    }
    return mainNode;
};
exports.builder = builder;
//# sourceMappingURL=index.js.map