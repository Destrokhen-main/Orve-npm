import createApp from "./core/index";
import { ref } from "./core/reactive/index.js";
import { watch } from "./core/watch/index.js";
import { refC } from "./core/reactiveComponent/index.js";
import { effect } from "./core/effect/index.js";

export {
  createApp,
  ref,
  refC,
  watch,
  effect
}