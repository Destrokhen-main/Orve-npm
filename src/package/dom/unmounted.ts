import { Node } from "./../jsx";
import { Orve } from "../default";

function unmounted(tree: Node): void {
  if (tree.hooks !== undefined && tree.hooks.unmounted!== undefined) {
    tree.hooks.unmounted({
      context: Orve.Context,
      oNode: tree
    });
  }

  if (tree.child !== undefined && tree.child.length > 0) {
    for (let i = 0; i !== tree.child.length; i++) {
      unmounted(tree.child[i]);
    }
  }
}

export { unmounted }