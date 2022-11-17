class error extends Error {
  constructor(message) {
    super(message);
    this.name = "sReact";
  }
}

const createError = function (message: string): void {
  throw new error(message);
};

export default createError;
