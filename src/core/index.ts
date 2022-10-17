declare global {
  interface Window {
    sReact: any
  }
}

import { CreateApp } from "./tsType";

import { builder } from "./builder/index";
import { mount } from "./mount/index";
import { Node } from "./tsType";
import { createObjectContext } from "./helper";

export default function ({ App, ...all } : { App:() => Node }): CreateApp {
  const Context = createObjectContext(all);
  window.sReact = {
    sReactContext: Context,
    sReactDOM: builder.bind(Context)(App)
  }
  return {
    mount: function(query: string){
      window.sReact.sReactDOM = mount(query);
    }
  };
};