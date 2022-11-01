import error from "../error/error";
import { typeOf } from "../helper/index";

import errorMessage from "../error/watch"

const w = function(callback: () => void, depends: any) {
  if (depends === undefined) {
    error(errorMessage.NEED_DEP)
  }

  if (typeOf(depends) !== 'proxy') {
    error(errorMessage.NEED_PROXY);
  }

  depends.parent.push({
    type: "watch",
    function: callback
  });
}

export const watch = w;