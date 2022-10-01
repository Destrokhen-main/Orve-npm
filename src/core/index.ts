declare global {
  interface Window {
    sReactDOM : any;
  }
}

import { CreateApp } from "./tsType";

import { builder } from "./builder/index";
import mount from "./mount/index";
import { Node } from "./tsType";

export default (app: () => Node): CreateApp => {
  window.sReactDOM = builder(app);
  return {
    mount: (query: string) => {
      window.sReactDOM = mount(query);
    }
  };
};