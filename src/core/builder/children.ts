import { typeOf } from "../helper/index";
import { validatorTagNode } from "../linter/index";
import { Type } from "../tsType/type";
import TYPE_MESSAGE from "../error/errorMessage";
import { ProxyType } from "../tsType/type";
import { builder } from "../builder/index";
import { Node } from "../tsType/index";
import { objectToArray } from "../helper";

import recursiveCheckFunctionAnswer from "./recuriveFunction";

const recursiveChild = function (
  nodeProps = null,
  nodeChilds: Node[],
  callback: () => Record<string, unknown>,
) {
  if (
    nodeChilds !== undefined &&
    typeOf(nodeChilds) === "array" &&
    nodeChilds.length > 0
  ) {
    nodeChilds = nodeChilds.flat(1);
    return nodeChilds.map((child: string | number | any) => {
      const typeChild = typeOf(child);
      if (
        typeof child === "string" &&
        child.includes("<") &&
        child.includes(">") &&
        (child.includes("</") || child.includes("/>"))
      ) {
        return {
          type: Type.HTMLCode,
          value: child,
        };
      }

      if (typeChild === "string" || typeChild === "number") {
        return {
          type: Type.NotMutable,
          value: child,
        };
      }

      if (typeChild === "object") {
        if (child["child"] !== undefined) {
          child["child"] = objectToArray(child["child"]);
        }

        validatorTagNode(child);

        if (typeof child["tag"] === "function") {
          const nodeTag = recursiveCheckFunctionAnswer.bind(this)(child);

          if (nodeTag["child"] !== undefined) {
            nodeTag["child"] = recursiveChild.bind(this)(
              nodeTag["props"],
              nodeTag["child"],
            );
          }

          return {
            type: Type.Layer,
            value: nodeTag,
            parent: child,
          };
        } else {
          if (child["child"] !== undefined) {
            child["child"] = recursiveChild.bind(this)(
              child["props"],
              child["child"],
            );
          }
        }

        return {
          type: Type.Component,
          value: child,
        };
      }

      if (typeChild === "function") {
        const object =
          nodeProps !== undefined
            ? callback.bind(this)(child, nodeProps)
            : callback.bind(this)(child);
        return {
          type: Type.Component,
          value: object,
          function: child,
        };

        // const typeCompleteFunction = typeOf(completeFunction);
        // validateFunctionAnswer(completeFunction, index);

        // if (typeCompleteFunction === "object") {
        //   if (completeFunction["child"] !== undefined) {
        //     completeFunction["child"] = objectToArray(completeFunction["child"])
        //   }

        //   validatorTagNode(completeFunction);

        //   if (typeof completeFunction["tag"] === "function") {
        //     completeFunction = recursiveCheckFunctionAnswer.bind(this)(completeFunction);
        //   }

        //   if (completeFunction["child"] !== undefined) {
        //     completeFunction["child"] = recursiveChild.bind(this)(completeFunction["props"], completeFunction["child"]);
        //   }

        //   return {
        //     type: Type.ComponentMutable,
        //     value:completeFunction,
        //     function: child,
        //   }
        // }

        // if (typeCompleteFunction === "string" || typeCompleteFunction === "number") {
        //   return {
        //     type: Type.Mutable,
        //     value: completeFunction,
        //     function: child,
        //   }
        // }
      }

      if (typeChild === "proxy") {
        const typeProxy = child.typeProxy;

        if (typeProxy === ProxyType.proxySimple) {
          return {
            type: Type.Proxy,
            value: child.value,
            proxy: child,
          };
        }

        if (typeProxy === ProxyType.proxyComponent) {
          let result = builder.bind(this)(child.value);

          if (typeof result["tag"] === "function") {
            result = recursiveCheckFunctionAnswer.bind(this)(result);
          }

          return {
            type: Type.ProxyComponent,
            value: result,
            proxy: child,
          };
        }

        if (typeProxy === ProxyType.proxyEffect) {
          return {
            type: Type.ProxyEffect,
            value: child.value,
            proxy: child,
          };
        }

        if (typeProxy === ProxyType.proxyObject) {
          console.warn(TYPE_MESSAGE.incorrectUsedRefO);
          return {
            type: Type.NotMutable,
            value: "",
          };
        }
      }
    });
  } else {
    return [];
  }
};

export default recursiveChild;
