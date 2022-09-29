const createApp = require("./core/index.js");
const { ref } = require("./core/reactive/index.js");
const { watch } = require("./core/watch/index.js");
const { refC } = require("./core/reactiveComponent/index.js");
const { effect } = require("./core/effect/index.js");

module.exports = {
  createApp,
  ref,
  refC,
  watch,
  effect
}