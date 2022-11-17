declare global {
  interface Window {
    sReact: Record<string, object>;
  }
}

import { CreateApp } from "./tsType";

import { builder } from "./builder/index";
import { mount } from "./mount/index";
import { Node } from "./tsType";
import { createObjectContext } from "./helper";

let Context: object = null;

export const createApp = function ({
  App,
  ...all
}: {
  App: () => Node;
}): CreateApp {
  Context = createObjectContext(all);

  window.sReact = {
    sReactContext: Context,
    sReactDOM: builder.bind(Context)(App),
  };

  return {
    mount: function (query: string) {
      window.sReact.sReactDOM = mount(query);
    },
  };
};

export const context = () => {
  if (
    window.sReact !== undefined &&
    window.sReact.sReactContext !== undefined
  ) {
    return window.sReact.sReactContext;
  } else {
    return Context;
  }
};
