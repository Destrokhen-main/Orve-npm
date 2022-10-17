declare global {
  interface Window {
    sReactDOM : any;
  }
}

import { CreateApp } from "./tsType";

import { builder } from "./builder/index";
import mount from "./mount/index";
import { Node } from "./tsType";

export default function ({App, ...app}: {App:() => Node}): CreateApp {
  const Context = {};
  Object.keys(app).forEach((e) => {
    Object.keys(app[e]).forEach((l) => {
      Context[l] = app[e][l];
    })
  })

  window.sReactDOM = builder.bind(Context)(App);
  return {
    mount: function(query: string){
      window.sReactDOM = mount(query);
    }
  };
};