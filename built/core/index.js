"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./builder/index");
var index_2 = require("./mount/index");
function default_1(app) {
    window.sReactDOM = (0, index_1.builder)(app);
    return {
        mount: function (query) {
            window.sReactDOM = (0, index_2.default)(query);
        }
    };
}
exports.default = default_1;
;
