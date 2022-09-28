const builder = require("./builder/index.js");
const mount = require("./mount/index.js");

module.exports = (app) => {
  window.sReactDOM = builder(app);
  return {
    mount: (query) => {
      window.sReactDOM = mount(query);
    }
  };
};