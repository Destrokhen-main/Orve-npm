import error from "../error/error";
import { typeOf } from "../helper/index";

const w = function(callback: () => void, depends: any) {
  if (depends === undefined) {
    error("Нет зависимостей для ")
  }

  if (typeOf(depends) !== 'proxy') {
    error("Вы можете наблюдать только за proxy");
  }

  depends.parent.push({
    type: "watch",
    function: callback
  });
}

export const watch = w;