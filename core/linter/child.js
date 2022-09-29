const { typeOf } = require("../helper/index.js");
const error = require("../error/error.js");
const errorMessage = require("../error/errorMessage.js");

const SUPPORTED_CHILD_RESULT = ["string", "object", "array"];

const validateChildFunction = (res, index) => {
  const typeResult = typeOf(res);
  if (!SUPPORTED_CHILD_RESULT.includes(typeResult)) error(`${res} | номер в массиве: ${index} - ${errorMessage.unsupportedTagC}`);
  return typeResult;
}

const SUPPORTED_TYPE_CHILDREN = ["function", "string", "proxy", "object", "number"];
const validatorChild = (childs) => {
  childs = childs.flat(1);
  if (typeOf(childs) !== "array") error(`${childs} - ${errorMessage.childNotArray}`);

  if (childs.length > 0)
    childs.forEach((child) => { 
      if (!SUPPORTED_TYPE_CHILDREN.includes(typeOf(child))) error(`${typeOf(child)} - ${errorMessage.unsupportedTagC}`);
    });
}

module.exports = {
  validateChildFunction,
  validatorChild
}