import { Node } from "../tsType/index";
import { typeOf } from "../helper/index";
import errorMessage from "../error/errorMessage";
import error from "../error/error";
import { validatorTagNode } from "../linter/index";

interface Props {
  children?: Array<Node>;
}

const recursive = function (node: Node) {
  let haveDop = false;
  let propsCh: Props = {};

  const { tag, props, child, hooks, ref }: Node = node;

  if (props !== undefined) {
    propsCh = props;
    haveDop = true;
  }

  if (child !== undefined) {
    propsCh["children"] = child.flat(1);
    haveDop = true;
  }

  if (hooks !== undefined) {
    propsCh["hooks"] = hooks;
    haveDop = true;
  }

  const fTag: any = haveDop ? tag.bind(this)(propsCh) : tag.bind(this)();

  if (typeOf(fTag) !== "object") {
    error(`rec-func - ${errorMessage.functionInTagReturn}`);
  }

  validatorTagNode(fTag);

  if (typeof fTag["tag"] === "function") {
    return recursive.bind(this)(fTag);
  }

  if (hooks) {
    fTag["hooks"] = hooks;
  }

  if (ref) {
    fTag["ref"] = ref;
  }

  return fTag;
};

export default recursive;
