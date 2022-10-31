"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNodeRebuild = void 0;
var addProps_1 = require("./addProps");
var addChild_1 = require("./addChild");
var cNodes = function (app, node) {
    var tag = node.tag, props = node.props, child = node.child;
    var Tag = document.createElement(tag);
    node["node"] = Tag;
    if (props !== undefined && Object.keys(props).length > 0) {
        (0, addProps_1.addProps)(Tag, props);
    }
    if (child !== undefined && child.length > 0) {
        node["child"] = (0, addChild_1.addChild)(Tag, child, cNodes);
    }
    if (app === null)
        return Tag;
    app.appendChild(Tag);
    return node;
};
exports.createNodeRebuild = cNodes;
//# sourceMappingURL=rebiuld.js.map