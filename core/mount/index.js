const error = require("../error.js");

const { createNode } = require("./createNode.js");

module.exports = (query) => {
  const APP = document.querySelector(query);
  const node = window.sReactDOM;

  if (APP === null)
    error("Не смог найти tag " + query);

  return createNode(APP, node);
}