const { typeOf } = require("../helper/index.js");
const { validatorTagNode, validateFunctionAnswer } = require("../linter/index.js");
const Type = require("./type.js");
const error = require("../error/error.js");
const TYPE_MESSAGE = require("../error/errorMessage.js");
const TypeProxy = require("../type/proxy.js");

const HTML_TAG = ["br","hr"];

const recursiveCheckFunctionAnswer = (node) => {
  let haveDop = false;
  let functionObject = {};

  if (node["props"] !== undefined) {
    functionObject = {
      ...node["props"]
    }
    haveDop = true;
  }

  if (node["child"] !== undefined) {
    functionObject["children"] = node['child'];
    haveDop = true;
  }

  const completeFunction = haveDop ? node["tag"]({
    ...functionObject
  }) : node["tag"]();
  const typeCompleteFunction = typeOf(completeFunction);
  if (typeCompleteFunction !== "object") {
    error(`index in array ${index} - ${TYPE_MESSAGE.functionInTagReturn}`);
  }

  if (typeof completeFunction["tag"] === "function") {
    return recursiveCheckFunctionAnswer(completeFunction);
  }

  return completeFunction;
}

const recursiveChild = (nodeProps = null, nodeChilds) => {
  if (
    nodeChilds !== undefined &&
    typeOf(nodeChilds) === "array" &&
    nodeChilds.length > 0
  ) {
    nodeChilds = nodeChilds.flat();
    return nodeChilds.map((child, index) => {
      const typeChild = typeOf(child);

      if (typeChild === "string") {
        if (child.startsWith("<") && child.endsWith(">")) {
          const parsedTag = child.replace(/[<,>,\/]/gm, "").trim();
          if (HTML_TAG.includes(parsedTag)) {
            return {
              type: Type.Component,
              value: {
                tag: parsedTag,
              }
            }
          }
        } else if (
          child.startsWith("<") && !child.endsWith(">") ||
          !child.startsWith("<") && child.endsWith(">")
        ) {
          error(`${child} - не используйте "<",">" отдельно в название`);
        }
      }

      if (typeChild === "string" || typeChild === "number") {
        return {
          type: Type.NotMutable,
          value: child
        }
      }

      if (typeChild === "object") {
        validatorTagNode(child);

        if(typeof child["tag"] === "function") {
          let haveDop = false;
          let functionObject = {};

          if (child["props"] !== undefined) {
            functionObject = {
              ...child["props"]
            }
            haveDop = true;
          }

          if (child["child"] !== undefined) {
            functionObject["children"] = child['child'];
            haveDop = true;
          }

          let completeFunction = haveDop ? child["tag"]({
            ...functionObject
          }) : child["tag"]();
          const typeCompleteFunction = typeOf(completeFunction);

          if (typeCompleteFunction !== "object") {
            error(`index in array ${index} - ${TYPE_MESSAGE.functionInTagReturn}`);
          }

          validatorTagNode(completeFunction);
          
          if (typeof completeFunction["tag"] === "function") {
            completeFunction = recursiveCheckFunctionAnswer(completeFunction);
          }

          if (completeFunction["child"] !== undefined)
            completeFunction["child"] = recursiveChild(completeFunction["props"], completeFunction["child"]);
          return {
            type: Type.Component,
            value: completeFunction,
          }
        } else {
          if (child["child"] !== undefined)
            child["child"] = recursiveChild(child["props"], child["child"]);
        }

        return {
          type: Type.Component,
          value: child,
        }
      }

      if (typeChild === "function") {
        let completeFunction = nodeProps !== undefined ? child(nodeProps) : child();
        const typeCompleteFunction = typeOf(completeFunction);
        validateFunctionAnswer(completeFunction, index);
        if (typeCompleteFunction === "object") {
          validatorTagNode(completeFunction);

          if (typeof completeFunction["tag"] === "function") {
            completeFunction = recursiveCheckFunctionAnswer(completeFunction);
          }

          if (completeFunction["child"] !== undefined)
            completeFunction["child"] = recursiveChild(completeFunction["props"], completeFunction["child"]);

          return {
            type: Type.ComponentMutable,
            value:completeFunction,
            function: child,
          }
        }

        if (typeCompleteFunction === "string" || typeCompleteFunction === "number") {
          return {
            type: Type.Mutable,
            value: completeFunction,
            function: child,
          }
        }

      }

      if (typeChild === "proxy") {
        const typeProxy = child.typeProxy;

        if (typeProxy === TypeProxy.proxySimple) {
          return {
            type: Type.Proxy,
            value: child.value,
            proxy: child
          }
        }

        if (typeProxy === TypeProxy.proxyComponent) {
          const builder = require("../builder/index.js");
          let result = builder(child.value);

          if (typeof result["tag"] === "function") {
            result = recursiveCheckFunctionAnswer(result);
          }

          return {
            type: Type.ProxyComponent,
            value: result,
            proxy: child
          }
        }

        if (typeProxy === TypeProxy.proxyEffect) {
          return {
            type: Type.ProxyEffect,
            value: child.value,
            proxy: child
          }
        }
      }
    });
  } else {
    return [];
  }

}

export default recursiveChild;