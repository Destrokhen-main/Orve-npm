"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = void 0;
var errorMessage_1 = require("../error/errorMessage");
var error_1 = require("../error/error");
var index_1 = require("../linter/index");
var index_2 = require("../helper/index");
var type_1 = require("../tsType/type");
var children_1 = require("./children");
var recursive = function (node) {
    var haveDop = false;
    var propsCh = {};
    var tag = node.tag, props = node.props, child = node.child;
    if (props !== undefined) {
        propsCh = props;
        haveDop = true;
    }
    if (child !== undefined) {
        propsCh["children"] = child.flat(1);
        haveDop = true;
    }
    var fTag = haveDop
        ? tag.bind(this)(propsCh)
        : tag.bind(this)();
    if ((0, index_2.typeOf)(fTag) !== "object") {
        (0, error_1.default)("rec-func - ".concat(errorMessage_1.default.functionInTagReturn));
    }
    (0, index_1.validatorTagNode)(fTag);
    if (typeof fTag["tag"] === "function") {
        return recursive.bind(this)(fTag);
    }
    return fTag;
};
var builder = function (app) {
    if ((0, index_2.typeOf)(app) !== "function")
        (0, error_1.default)("".concat(app, " - ").concat(errorMessage_1.default.appNotAFunction));
    var mainNode = app.bind(this)();
    if ((0, index_2.typeOf)(mainNode) !== "object")
        (0, error_1.default)("".concat(mainNode, " - ").concat(errorMessage_1.default.resultCallNotAObject));
    // check mainNode
    index_1.validatorMainNode.bind(this)(mainNode);
    // if tag have function
    if (typeof mainNode["tag"] === "function") {
        mainNode = recursive.bind(this)(mainNode);
    }
    mainNode["type"] = type_1.Type.Component;
    var props = mainNode.props, child = mainNode.child;
    if (child !== undefined) {
        mainNode["child"] = children_1.default.bind(this)(props, child);
    }
    return mainNode;
};
exports.builder = builder;
