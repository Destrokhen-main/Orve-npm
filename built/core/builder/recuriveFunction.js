"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../helper/index");
var errorMessage_1 = require("../error/errorMessage");
var error_1 = require("../error/error");
var index_2 = require("../linter/index");
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
    if ((0, index_1.typeOf)(fTag) !== "object") {
        (0, error_1.default)("rec-func - ".concat(errorMessage_1.default.functionInTagReturn));
    }
    (0, index_2.validatorTagNode)(fTag);
    if (typeof fTag["tag"] === "function") {
        return recursive.bind(this)(fTag);
    }
    return fTag;
};
exports.default = recursive;
//# sourceMappingURL=recuriveFunction.js.map