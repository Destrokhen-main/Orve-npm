const error = require("../error.js");
const { typeOf } = require("../helper/index.js");
const errorMessage = require("../errorMessage.js");

const SUPPORTED_VARIABLES = ["tag", "props", "child"];
const SUPPORTED_TYPE_PROPS = ["function", "string", "proxy", "number", "object", "array"];
const SUPPORTED_TYPE_CHILDREN = ["function", "string", "proxy", "object", "number"];


const validatorProps = (props) => {
  if (typeOf(props) !== "object") error(errorMessage.propsNotAObject);

  // check all variables in object props
  Object.keys(props).forEach((key) => {

    const value = props[key];

    // this is event function
    if (key.startsWith("@")) {
      if (typeOf(value) !== "function") error(`${key} - ${errorMessage.eventNotAFunction}`);
    }
    if (typeOf(value) === "object") {
      if (key === "src") {
        if (value["__esModule"] !== undefined && value["default"] === undefined)
          error(`${key} - ${errorMessage.incorrectPropsValue}`)
      } 
    } else if (!SUPPORTED_TYPE_PROPS.includes(typeOf(value)))
      error(`${key} - ${errorMessage.incorrectPropsValue}`);
  });
}

const CORRECT_PROPS_FUNCTION = ["string", "proxy", "number"];
const validSingleProps = (prop, pr) => {
  if (!CORRECT_PROPS_FUNCTION.includes(typeOf(prop)))
    error(`${pr} - ${errorMessage.incorrectPropsValue}`);
}

const validatorChild = (childs) => {
  childs = childs.flat(1);
  if (typeOf(childs) !== "array") error(`${childs} - ${errorMessage.childNotArray}`);

  if (childs.length > 0)
    childs.forEach((child) => { 
      if (!SUPPORTED_TYPE_CHILDREN.includes(typeOf(child))) error(`${typeOf(child)} - ${errorMessage.unsupportedTagC}`);
    });
} 

const validatorMainNode = (node) => {
  // check unsupported object variables
  Object.keys(node).forEach((key) => {
    if (!SUPPORTED_VARIABLES.includes(key)) error(`${key} - ${errorMessage.useUnsupportedVariables}`);
  });
  const { tag, props, child} = node;

  // check exist tag
  if(tag === undefined) error(errorMessage.missTagOnObject);
  if(props !== undefined) validatorProps(props);
  if(child !== undefined) validatorChild(child);
}

const SUPPORTED_CHILD_RESULT = ["string", "object", "array"];

const validateChildFunction = (res, index) => {
  const typeResult = typeOf(res);
  if (!SUPPORTED_CHILD_RESULT.includes(typeResult)) error(`${res} | номер в массиве: ${index} - ${errorMessage.unsupportedTagC}`);
  return typeResult;
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
  if(child !== undefined) validatorChild(child);
}

module.exports = {
  validatorMainNode,
  validateChildFunction,
  validatorTagNode,
  validSingleProps,
  validateFunctionAnswer
}