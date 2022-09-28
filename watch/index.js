const error = require("../core/error.js");
const { typeOf } = require("../core/helper/index.js");

const w = (callback, depends) => {
  if (depends === undefined) {
    error("Нет зависимостей для ")
  }

  if (typeOf(depends) !== 'proxy') {
    error("Вы можете наблюдать только за proxy");
  }

  depends.parent.push({
    type: "watch",
    function: callback
  });
}

module.exports.watch = w;