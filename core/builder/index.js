const { typeOf } = require("../helper/index.js");
const errorMessage = require("../errorMessage.js");
const error = require("../error.js");
const { validatorMainNode } = require("../linter/index.js");
const Type = require("./type.js");

const reqChild = require("./children.js");

const recursive = (funct) => {
  let haveDop = false;
  let functionObject = {};

  if (funct["props"] !== undefined) {
    functionObject = {
      ...funct["props"]
    }
    haveDop = true;
  }

  if (funct["child"] !== undefined) {
    functionObject["children"] = funct['child'];
    haveDop = true;
  }

  const completeFunction = haveDop ? funct["tag"]({
    ...functionObject
  }) : funct["tag"]();
  const typeCompleteFunction = typeOf(completeFunction);
  if (typeCompleteFunction !== "object") {
    error(`index in array ${index} - ${TYPE_MESSAGE.functionInTagReturn}`);
  }

  if (typeof completeFunction["tag"] === "function") {
    return recursive(completeFunction);
  }

  return completeFunction;
}

const s = (app) => {
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
  mainNode["reload"] = function() {};
  return mainNode;
}

module.exports = s;