import er, { message as m } from "./error";
import { parser } from "./builder/index";
import { ONodeOrve } from "./types";
import { mount } from "./mount/index";

// NOTE type

type createApp = {
  mount: (( _ : string) => void)
}

type AppWithContext = {
  App: () => unknown,
}

type Cons = {
  DOM: ONodeOrve,
  context: Record<string, any>
}

declare global {
  interface Window {
    orve: Cons
  }
}

// NOTE plugin's
let CONTEXT;
const createObjectContext = function (app: object): object {
  const Context: Record<string, unknown> = {};
  Object.keys(app).forEach((e) => {
    Object.keys(app[e]).forEach((l) => {
      if (l.startsWith("$")) {
        Context[l] = app[e][l];
      } else {
        Context[`$${l}`] = app[e][l];
      }
    });
  });
  return Context;
};


// NOTE function 
function createApp(app: AppWithContext | (() => unknown)): createApp {
  const type = typeof app;

  window.orve = {
    context: null,
    DOM: null,
  };

  if (type === "object") {
    const { App, ...context } = app as AppWithContext;
    const parsedContext = createObjectContext(context);
    window.orve.context = parsedContext;
    CONTEXT = parsedContext;
    window.orve.DOM = parser.call(CONTEXT, App);
    console.log(window.orve.DOM);
    // start building |App|
  }

  if (type === "function") {
    window.orve.context = {};
    CONTEXT = {};
    // start build |app|
  }

  if(type === "function" || type === "object") {
    return {
      mount: (query: string) => mount.bind(CONTEXT)(query)
    }
  }

  er(m.UNSUPPORTED_TYPE_APP);
}

function context() {
  return window.orve && window.orve.context !== null 
          ? window.orve.context
          : CONTEXT;
}

export {
  createApp,
  context
}