declare global {
  interface Window {
    Orve: Record<string, any>;
    orve: Record<string, any>;
  }
}

export interface Plugin {
  setup: (obj: any) => void;
}

const Orve: Record<string, any> = {
  use: function (obj?: Plugin) {
    if (obj === undefined) {
      console.error(`Error: \n "${obj}" not a plugin`);
      return;
    }

    if (obj.setup) {
      obj.setup(this);
    } else {
      Object.keys(obj).forEach((i) => {
        this.context[i] = (obj as Record<string, any>)[i];
      });
    }
  },
  context: {},
  tree: {},
};

const addedInOrve = (key: string, value: unknown) => {
  if (Orve[key]) {
    Orve[key] = Object.assign(Orve[key], value);
  } else {
    Orve[key] = value;
  }
};

if (window !== undefined) {
  window.Orve = Orve;
}

function context() {
  return Orve;
}

export { addedInOrve, Orve, context };
