import { refL, ref, refC, watch, refO, refA, effect } from "../index";

const Orve: Record<string, unknown> = {
  use: function(obj) {
    if (!obj) {
      console.error(`Error: \n "${obj}" not a plugin`);
      return;
    }
    if (obj.install) {
      if (obj.settings?.sendProjectOrve === true) {
        obj.install({...this, refL, ref, refC, watch, refO, refA, effect });
        return;
      }
      obj.install(this);
    } else {
      Object.keys(obj).forEach((i) => {
        this.context[i] = obj[i];
      })
    }
  },
  context: {},
  tree: {}
};

const addedInOrve = (key: string, value:unknown) => {
  if (Orve[key]) {
    Orve[key] = Object.assign(Orve[key], value)
  } else {
    Orve[key] = value;
  }
}

export {
  addedInOrve,
  Orve
};