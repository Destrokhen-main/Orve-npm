import { typeOf } from "../helper/index";
import { validatorTagNode, validateFunctionAnswer } from "../linter/index";
import { Type } from "../tsType/type";
import error from "../error/error";
import TYPE_MESSAGE from "../error/errorMessage";
import { ProxyType } from "../tsType/type";
import { builder } from "../builder/index";
import { Node } from "../tsType/index";

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

  const completeFunction = haveDop
                            ? node["tag"].bind(this)({ ...functionObject })
                            : node["tag"].bind(this)();

  const typeCompleteFunction = typeOf(completeFunction);
  
  if (typeCompleteFunction !== "object") {
    error(`error ${TYPE_MESSAGE.functionInTagReturn}`);
  }

  if (typeof completeFunction["tag"] === "function") {
    return recursiveCheckFunctionAnswer.bind(this)(completeFunction);
  }

  return completeFunction;
}

const recursiveChild = function(nodeProps = null, nodeChilds: Node[]) {
  if (
    nodeChilds !== undefined &&
    typeOf(nodeChilds) === "array" &&
    nodeChilds.length > 0
  ) {
    nodeChilds = nodeChilds.flat(1);

    return nodeChilds.map((child: any, index: number) => {
      const typeChild = typeOf(child);

      if (typeChild === "string" && (child.startsWith("<") && child.endsWith(">"))) {
        const parse = child.replace(/[<,> + \/]/gm, "");
        return {
          type: Type.HTMLCode,
          value: child,
        }
      }

      if (typeChild === "string" || typeChild === "number") {
        return {
          type: Type.NotMutable,
          value: child
        }
      }

      if (typeChild === "object") {
        if (child["child"] !== undefined && typeOf(child["child"]) !== "array") {
          child["child"] = [child["child"]];
        }

        validatorTagNode(child);

        if(typeof child["tag"] === "function") {
          const nodeTag = recursiveCheckFunctionAnswer.bind(this)(child);

          if (nodeTag["child"] !== undefined) {
            nodeTag["child"] = recursiveChild.bind(this)(nodeTag["props"], nodeTag["child"]);
          }

          return {
            type: Type.Layer,
            value: nodeTag,
            parent: child,
          }
        } else {
          if (child["child"] !== undefined) {
            child["child"] = recursiveChild.bind(this)(child["props"], child["child"]);
          }
        }

        return {
          type: Type.Component,
          value: child,
        }
      }

      if (typeChild === "function") {
        let completeFunction = nodeProps !== undefined
                                ? child.bind(this)(nodeProps)
                                : child.bind(this)();
        
        const typeCompleteFunction = typeOf(completeFunction);
        validateFunctionAnswer(completeFunction, index);

        if (typeCompleteFunction === "object") {
          if (completeFunction["child"] !== undefined && typeOf(completeFunction["child"]) !== "array") {
            completeFunction["child"] = [completeFunction["child"]]
          }

          validatorTagNode(completeFunction);

          if (typeof completeFunction["tag"] === "function") {
            completeFunction = recursiveCheckFunctionAnswer.bind(this)(completeFunction);
          }

          if (completeFunction["child"] !== undefined) {
            completeFunction["child"] = recursiveChild.bind(this)(completeFunction["props"], completeFunction["child"]);
          }

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
          let result = builder.bind(this)(child.value);

          if (typeof result["tag"] === "function") {
            result = recursiveCheckFunctionAnswer.bind(this)(result);
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