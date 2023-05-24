import { createApp } from "./package/dom/index";
import { refL } from "./package/reactive/refL";
import { ref } from "./package/reactive/ref";
import { refC } from "./package/reactive/refC";
import { watch } from "./package/reactive/watch";
import { refO } from "./package/reactive/refO";
import { refA } from "./package/reactive/refA";
import { effect } from "./package/reactive/effect";
import { oif } from "./package/reactive/oif"; 
import { Orve, context } from "./package/default";
import { Node, Fragment } from "./package/jsx";
import { createAppRoot } from "./package/dom/root";
export {
  createApp,
  refL,
  ref,
  refC,
  watch,
  refO,
  refA,
  effect,
  Orve,
  Node,
  Fragment,
  oif,
  context,
  createAppRoot
};

export default {
  createApp,
  ...Orve,
  Node,
  Fragment,
  createAppRoot
};