var error = require("../error/error.js");
var createNode = require("./createNode.js").createNode;
module.exports = function (query) {
    var APP = document.querySelector(query);
    var node = window.sReactDOM;
    if (APP === null)
        error("Не смог найти tag " + query);
    return createNode(APP, node);
};
