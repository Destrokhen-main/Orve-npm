const error = require("../error/error.js");

const { createNode } = require("./createNode.js");

export default (query) => {
  const APP = document.querySelector(query);
  const node = window.sReactDOM;

  if (APP === null)
    error("Не смог найти tag " + query);

  return createNode(APP, node);
}