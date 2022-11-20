import errorMessage from "../error/errorMessage";
import error from "../error/error";
import { validatorMainNode } from "../linter/index";

import { typeOf } from "../helper/index";

import { Type } from "../tsType/type";
import { Node, VNode } from "../tsType";
import { objectToArray } from "../helper";

import reqChild from "./children";
import recursive from "./recuriveFunction";

export const builder = function (
  app: () => unknown | Node,
  Props = null,
): VNode {
  if (typeOf(app) !== "function") {
    if (typeOf(app) === "object") {
      app = () => app;
    } else {
      error(`${app} - ${errorMessage.appNotAFunction}`);
    }
  }

  let mainNode: any = Props !== null ? app.bind(this)(Props) : app.bind(this)();

  if (typeOf(mainNode) !== "object") {
    error(`${mainNode} - ${errorMessage.resultCallNotAObject}`);
  }

  if (mainNode["child"] !== undefined)
    mainNode["child"] = objectToArray(mainNode["child"]);

  // check mainNode
  validatorMainNode(mainNode);

  // if tag have function
  if (typeof mainNode["tag"] === "function") {
    mainNode = recursive.bind(this)(mainNode);
  }

  mainNode["type"] = Type.Component;
  const { props, child } = mainNode;

  if (child !== undefined) {
    mainNode["child"] = reqChild.bind(this)(props, child);
  }

  if (
    mainNode["hooks"] !== undefined &&
    mainNode["hooks"]["created"] !== undefined
  ) {
    mainNode["hooks"]["created"]({ ...this, ...mainNode });
  }
  return mainNode;
};
