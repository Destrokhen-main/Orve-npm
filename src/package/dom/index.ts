import er, { message as m } from "./error";
import { parser } from "./builder/index";
import { mount } from "./mount/index";
import { Orve } from "../default";

// NOTE type

type createApp = {
  mount: (_: string) => void;
};

type AppWithContext = {
  App: () => unknown;
};

// NOTE plugin's
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

  if (type === "object") {
    const { App, ...context } = app as AppWithContext;
    const parsedContext = createObjectContext(context);
    Object.keys(parsedContext).forEach((key) => {
      Orve.context[key] = parsedContext[key];
    })

    Orve.tree = parser.call(Orve, App);
    // start building |App|
  }

  if (type === "function") {
    Orve.tree = parser.call(Orve, app);
  }

  if (type === "function" || type === "object") {
    return {
      mount: (query: string) => mount.bind(Orve)(query),
    };
  }

  er(m.UNSUPPORTED_TYPE_APP);
}

function context() {
  return Orve;
}

export { createApp, context };
