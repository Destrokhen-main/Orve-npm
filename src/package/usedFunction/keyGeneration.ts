const STRING = "qwertyuiopasdfghjklzxcvbnm1234567890";

function generationID(num: number): string {
  let str = "";

  while (str.length < num) {
    const number = Math.round(Math.random() * STRING.length);
    str += STRING[number];
  }

  return str;
}

export { generationID };
