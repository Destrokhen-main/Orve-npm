const { typeOf } = require("../helper/index.js");
const errorMessage = require("../error/errorMessage.js");
const error = require("../error/error.js");
const { validatorMainNode, validatorTagNode } = require("../linter/index.js");
const Type = require("./type.js");

const reqChild = require("./children.js");

const recursive = (funcs) => {
  let haveDop = false;
  let functionObject = {};

  if (funcs["props"] !== undefined) {
    functionObject = {
      ...funcs["props"]
    }
    haveDop = true;
  }

  if (funcs["child"] !== undefined) {
    functionObject["children"] = funcs['child'];
    haveDop = true;
  }

  const completeFunction = haveDop ? funcs["tag"]({
    ...functionObject
  }) : funcs["tag"]();
  const typeCompleteFunction = typeOf(completeFunction);
  if (typeCompleteFunction !== "object") {
    error(`index in array ${index} - ${TYPE_MESSAGE.functionInTagReturn}`);
  }
  validatorTagNode(completeFunction);

  if (typeof completeFunction["tag"] === "function") {
    return recursive(completeFunction);
  }

  return completeFunction;
}

module.exports = (app) => {
  if (typeOf(app) !== "function")
    error(`${app} - ${errorMessage.appNotAFunction}`);
  
  let mainNode = app();
  if (typeOf(mainNode) !== "object")
    error(`${mainNode} - ${errorMessage.resultCallNotAObject}`);
  // check mainNode
  validatorMainNode(mainNode);

  if (typeof mainNode["tag"] === "function")
    mainNode = recursive(mainNode);

  let {props, child} = mainNode;
  if (child !== undefined) {
    child = child.flat();
    mainNode["child"] = reqChild(props, child);
  }
  mainNode["type"] = Type.Component;
  return mainNode;
}