import { typeOf } from "../../usedFunction/typeOf";
import er, { message as m } from "./error";
import { isONode } from "../builder/validator";
import { Node } from "../../jsx";

function recursiveTag(node: Node) : Node {
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
    er(m.CALL_NODE_RETURN_NOT_A_OBJECT);
  }

  isONode(req);

  if (typeof req.tag === "function") {
    return recursiveTag.call(this, req);
  }

  if (node.hooks) req["hooks"] = node.hooks;
  if (node.ref) req["ref"] = node.ref;

  return req;
}

export { recursiveTag };
