import { typeOf } from "../../usedFunction/typeOf";
import { message as m } from "./error";
import { isONode } from "../builder/validator";
import { Node } from "../../jsx";

function recursiveTag(node: Node) : Node | undefined {
  let pr: Record<string, any> = {};

  if (node.props) {
    pr = node.props;
  }

  if (node.child) {
    pr["children"] = node.child;
  }
  
  let req: Node;
  if (Object.keys(pr).length > 0) {
    req = (node.tag as (args?: Record<string, any>) => any).call(this, pr);
  } else {
    req = (node.tag as (args?: Record<string, any>) => any).call(this, {});
  }

  if (typeOf(req) !== "object") {
    console.warn(`component: ${String(JSON.stringify(node)).substring(0, 50)}... \n${m.CALL_NODE_RETURN_NOT_A_OBJECT}`);
    return undefined;
  }

  isONode(req);

  if (typeof req.tag === "function") {
    console.log("before rec", req);
    return recursiveTag.call(this, req);
  }

  if (node.hooks) req["hooks"] = node.hooks;
  if (node.ref) req["ref"] = node.ref;

  return req;
}

export { recursiveTag };
