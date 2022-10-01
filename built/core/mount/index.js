"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("../error/error");
var createNode_1 = require("./createNode");
exports.default = (function (query) {
    var APP = document.querySelector(query);
    var node = window.sReactDOM;
    if (APP === null)
        (0, error_1.default)("Не смог найти tag " + query);
    return (0, createNode_1.createNode)(APP, node);
});
