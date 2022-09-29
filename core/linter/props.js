const { typeOf } = require("../helper/index.js");
const SUPPORTED_TYPE_PROPS = ["function", "string", "proxy", "number", "object", "array"];
const CORRECT_PROPS_FUNCTION = ["string", "proxy", "number"];

const error = require("../error/error.js");
const errorMessage = require("../error/errorMessage.js");

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
    } else if (!SUPPORTED_TYPE_PROPS.includes(typeOf(value))) {
      error(`${key} выдал ${value} - ${errorMessage.incorrectPropsValue}`);
    }
  });
}

const validSingleProps = (prop, pr) => {
  if (!CORRECT_PROPS_FUNCTION.includes(typeOf(prop)))
    error(`${pr} - ${errorMessage.incorrectPropsValue}`);
}

module.exports = {
  validatorProps,
  validSingleProps
}