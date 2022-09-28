const createApp = require("./core/index.js");
const { ref } = require("./reactive/index.js");
const { watch } = require("./watch/index.js");
const { refC } = require("./reactiveComponent/index.js");

module.exports = {
  createApp,
  ref,
  refC,
  watch
}