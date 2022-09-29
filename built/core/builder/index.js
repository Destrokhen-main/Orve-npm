"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorMessage_1 = require("../error/errorMessage");
var error_1 = require("../error/error");
var index_js_1 = require("../linter/index.js");
var index_1 = require("../helper/index");
var type_1 = require("./type");
var children_1 = require("./children");
var recursive = function (node) {
    var haveDop = false;
    var functionObject = {};
    var tag = node.tag, props = node.props, child = node.child;
    if (props !== undefined) {
        functionObject = props;
        haveDop = true;
    }
    if (child !== undefined) {
        functionObject["children"] = child.flat(1);
        haveDop = true;
    }
    var fTag = haveDop
        ? tag(functionObject)
        : tag();
    if ((0, index_1.typeOf)(fTag) !== "object") {
        (0, error_1.default)("rec-func - ".concat(errorMessage_1.default.functionInTagReturn));
    }
    (0, index_js_1.validatorTagNode)(fTag);
    if (typeof fTag["tag"] === "function") {
        return recursive(fTag);
    }
    return fTag;
};
exports.default = (function (app) {
    if ((0, index_1.typeOf)(app) !== "function")
        (0, error_1.default)("".concat(app, " - ").concat(errorMessage_1.default.appNotAFunction));
    var mainNode = app();
    if ((0, index_1.typeOf)(mainNode) !== "object")
        (0, error_1.default)("".concat(mainNode, " - ").concat(errorMessage_1.default.resultCallNotAObject));
    // check mainNode
    (0, index_js_1.validatorMainNode)(mainNode);
    // if tag have function
    if (typeof mainNode["tag"] === "function") {
        mainNode = recursive(mainNode);
    }
    var props = mainNode.props, child = mainNode.child;
    if (child !== undefined) {
        child = (0, children_1.default)(props, child);
    }
    mainNode["type"] = type_1.default.Component;
    return mainNode;
});
