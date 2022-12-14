import error from "../error/error";

import { createNode } from "./createNode";

export const mount = function (query: string) {
  const APP: HTMLElement = document.querySelector(query);
  const node = window.sReact.sReactDOM;

  if (APP === null) {
    error("Не смог найти tag " + query);
  }

  return createNode(APP, node);
};
