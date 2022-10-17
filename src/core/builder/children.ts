import { typeOf } from "../helper/index";
import { validatorTagNode, validateFunctionAnswer } from "../linter/index";
import { Type } from "../tsType/type";
import error from "../error/error";
import TYPE_MESSAGE from "../error/errorMessage";
import { ProxyType } from "../tsType/type";
import { builder } from "../builder/index.js";

const recursiveCheckFunctionAnswer = function(node) {
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

  const completeFunction = haveDop ? node["tag"].bind(this)({
    ...functionObject
  }) : node["tag"].bind(this)();
  const typeCompleteFunction = typeOf(completeFunction);
  if (typeCompleteFunction !== "object") {
    error(`error  ${TYPE_MESSAGE.functionInTagReturn}`);
  }

  if (typeof completeFunction["tag"] === "function") {
    return recursiveCheckFunctionAnswer.bind(this)(completeFunction);
  }

  return completeFunction;
}

const recursiveChild = function(nodeProps = null, nodeChilds) {
  if (
    nodeChilds !== undefined &&
    typeOf(nodeChilds) === "array" &&
    nodeChilds.length > 0
  ) {
    nodeChilds = nodeChilds.flat(1);

    return nodeChilds.map((child, index) => {
      const typeChild = typeOf(child);

      // <hr /> <br />
      if (typeChild === "string") {
        if (child.startsWith("<") && child.endsWith(">")) {
          //const parsedTag = child.replace(/[<,>,\/]/gm, "").trim();
          //if (HTML_TAG.includes(parsedTag)) {
          return {
            type: Type.HTMLCode,
            value: child,
          }
          //}
        }
      }

      // string and number
      if (typeChild === "string" || typeChild === "number") {
        return {
          type: Type.NotMutable,
          value: child
        }
      }

      if (typeChild === "object") {
        validatorTagNode(child);

        if(typeof child["tag"] === "function") {
          const nodeTag = recursiveCheckFunctionAnswer.bind(this)(child);

          if (nodeTag["child"] !== undefined)
            nodeTag["child"] = recursiveChild(nodeTag["props"], nodeTag["child"]);

          return {
            type: Type.Layer,
            value: nodeTag,
            parent: child,
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
        let completeFunction = nodeProps !== undefined ? child.bind(this)(nodeProps) : child.bind(this)();
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

        if (typeProxy === ProxyType.proxySimple) {
          return {
            type: Type.Proxy,
            value: child.value,
            proxy: child
          }
        }

        if (typeProxy === ProxyType.proxyComponent) {
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

        if (typeProxy === ProxyType.proxyEffect) {
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