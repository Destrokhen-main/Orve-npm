"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mount = void 0;
var error_1 = require("../error/error");
var createNode_1 = require("./createNode");
var mount = function (query) {
    var APP = document.querySelector(query);
    var node = window.sReact.sReactDOM;
    if (APP === null)
        (0, error_1.default)("Не смог найти tag " + query);
    return (0, createNode_1.createNode)(APP, node);
};
exports.mount = mount;
