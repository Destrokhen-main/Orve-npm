var addProps = require("./addProps.js").addProps;
var addChild = require("./addChild.js").addChild;
var cNode = function (app, node) {
    var tag = node.tag, props = node.props, child = node.child;
    var Tag = document.createElement(tag);
    node["node"] = Tag;
    if (props !== undefined && Object.keys(props).length > 0) {
        addProps(Tag, props, node);
    }
    if (child !== undefined && child.length > 0) {
        node["child"] = addChild(Tag, child, cNode);
    }
    app.appendChild(Tag);
    return node;
};
module.exports.createNode = cNode;
