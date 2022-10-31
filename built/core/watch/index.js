"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
var error_1 = require("../error/error");
var index_1 = require("../helper/index");
var w = function (callback, depends) {
    if (depends === undefined) {
        (0, error_1.default)("Нет зависимостей для ");
    }
    if ((0, index_1.typeOf)(depends) !== 'proxy') {
        (0, error_1.default)("Вы можете наблюдать только за proxy");
    }
    depends.parent.push({
        type: "watch",
        function: callback
    });
};
exports.watch = w;
//# sourceMappingURL=index.js.map