import er, { message as m } from "./error";
import { parser } from "./builder/index";
import { mount } from "./mount/index";
import { Orve } from "../default";
import { createObjectContext } from "./helperBuilder";
import { unmounted } from "./unmounted";

// NOTE type

export interface createApp {
  mount: (root: string) => void;
}

interface App {
  App: () => unknown;
}

function createApp(app: App | (() => unknown)): createApp | undefined {
  const type = typeof app;

  if (type === "object") {
    const { App, ...context } = app as App;
    const parsedContext: Record<string, any> = createObjectContext(context);
    if (Object.keys(parsedContext).length > 0) {
      Object.keys(parsedContext).forEach((key) => {
        Orve.context[key] = parsedContext[key];
      });
    }

    // start building app
    Orve.tree = parser.call(Orve.context, App);
  } else if (type === "function") {
    Orve.tree = parser.call(Orve.context, app as () => unknown);
  }

  if (window !== undefined) {
    window.onbeforeunload = function () {
      unmounted(Orve.tree);
    };
  }

  if (type === "function" || type === "object") {
    return {
      mount: (root: string) => mount(root),
    };
  }

  er(m.UNSUPPORTED_TYPE_APP);
}

export { createApp };
