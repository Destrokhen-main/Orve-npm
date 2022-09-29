const { typeOf } = require("../helper/index.js");

const error = require("../error/error.js");
const errorMessage = require("../error/errorMessage.js");

const { validatorProps , validSingleProps } = require ("./props.js");
const { validateChildFunction, validatorChild } = require("./child.js");



const SUPPORTED_VARIABLES = ["tag", "props", "child"];
const validatorMainNode = (node) => {
  // check unsupported object variables
  Object.keys(node).forEach((key) => {
    if (!SUPPORTED_VARIABLES.includes(key)) error(`${key} - ${errorMessage.useUnsupportedVariables}`);
  });
  const { tag, props, child} = node;

  // check exist tag
  if(tag === undefined) error(errorMessage.missTagOnObject);
  if(props !== undefined) validatorProps(props);
  if(child !== undefined) {
    if (Array.isArray(child))
      validatorChild(child);
    else
      error(`Child может быть только типа array`);
  }
}

const CORRECT_ANSWER = ["array", "string", "object", "number", "proxy"];
const validateFunctionAnswer = (res, index) => {
  if (res === undefined) error(`${res} | номер в массиве: ${index} - ${errorMessage.functionReturnUndefinedOrNull}`);
  const type = typeOf(res);
  if (!CORRECT_ANSWER.includes(type)) error(`${res} | номер в массиве: ${index} - ${errorMessage.functionReturnIncorrectData}`)
}

const TAG_TYPE_NODE = ["string", "function"];
const validatorTagNode = (node) => {
  Object.keys(node).forEach((key) => {
    if (!SUPPORTED_VARIABLES.includes(key)) error(`${key} - ${errorMessage.useUnsupportedVariables}`);
  });
  const { tag, props, child} = node;

  // check exist tag
  if(tag === undefined) error(errorMessage.missTagOnObject);

  if(!TAG_TYPE_NODE.includes(typeOf(tag))) error(`${JSON.stringify(node)} - ${errorMessage.unsupportedTag}`)

  if(props !== undefined) validatorProps(props);
  if(child !== undefined) {
    if(child !== undefined) {
      if (Array.isArray(child))
        validatorChild(child);
      else
        error(`Child может быть только типа array`);
    }
  }
}

module.exports = {
  validatorMainNode,
  validateChildFunction,
  validatorTagNode,
  validSingleProps,
  validateFunctionAnswer
}