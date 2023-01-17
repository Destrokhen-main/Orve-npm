const Orve: Record<string, unknown> = {
  use: function(obj) {
    if (!obj) {
      console.error(`Error: \n "${obj}" not a plugin`);
      return;
    }
    if (obj.setup) {
      obj.setup(this);
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

declare global {
  interface Window {
    Orve: Record<string, unknown>;
  }
}

if (window !== undefined) {
  window.Orve = Orve;
}

export {
  addedInOrve,
  Orve
};