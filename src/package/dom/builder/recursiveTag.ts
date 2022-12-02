import { ONodeOrve, Props, ONode } from "../types";
import { typeOf } from "../../usedFunction/typeOf";
import er, { message as m} from "./error";
import { isONode } from "../builder/validator"; 

function recursiveTag(node: ONodeOrve) {
  let pr: Props = {};

  if (node.props) {
    pr = node.props;
  }

  if (node.child) {
    pr["children"] = node.child;
  }

  let req: ONode;
  if (Object.keys(pr).length > 0) {
    req = (node.tag as () => ONode).call(this, pr);
  } else {
    req = (node.tag as () => ONode).call(this);
  }

  if(typeOf(req) !== "object") {
    er(m.CALL_NODE_RETURN_NOT_A_OBJECT);
  }

  isONode(req);

  if (typeof req === "function") {
    return recursiveTag.call(this, req);
  }

  if (node.hooks) req["hooks"] = node.hooks
  if (node.ref) req["ref"] = node.ref;
  
  return req;
}

export { recursiveTag }