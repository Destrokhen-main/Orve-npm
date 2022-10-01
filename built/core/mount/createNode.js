"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNode = void 0;
var addProps_1 = require("./addProps");
var addChild_1 = require("./addChild");
var cNode = function (app, node, type) {
    if (type === void 0) { type = null; }
    var tag = node.tag, props = node.props, child = node.child;
    var Tag = document.createElement(tag);
    node["node"] = Tag;
    if (type !== null) {
        node["type"] = type;
    }
    if (props !== undefined && Object.keys(props).length > 0) {
        (0, addProps_1.addProps)(Tag, props, node);
    }
    if (child !== undefined && child.length > 0) {
        node["child"] = (0, addChild_1.addChild)(Tag, child, cNode);
    }
    app.appendChild(Tag);
    return node;
};
exports.createNode = cNode;
