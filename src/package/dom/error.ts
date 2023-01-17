import { message } from "./erMessage";

class error extends Error {
  constructor(message) {
    super(message);
    this.name = "orve - DOM builder";
  }
}

export default function (message: string): void {
  throw new error(message);
}

export { message };
