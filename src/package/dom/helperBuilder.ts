const createObjectContext = function (
  context: Record<string, any>,
): Record<string, any> {
  const Context: Record<string, any> = {};

  if (Object.keys(context).length > 0) {
    Object.keys(context).forEach((keyContext: string) => {
      if (
        typeof context[keyContext] === "object" &&
        Object.keys(context[keyContext]).length > 0
      ) {
        Object.keys(context[keyContext]).forEach((key) => {
          const kContext = key.startsWith("$") ? key : "$" + key;
          Context[kContext] = context[keyContext][key];
        });
      }
    });
  } else {
    return {};
  }
  return Context;
};

export { createObjectContext };
