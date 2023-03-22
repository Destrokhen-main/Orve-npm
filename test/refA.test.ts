import { describe, expect, test } from "@jest/globals";

import { ref } from "../src/package/reactive/ref";
import { createApp } from "../src/index";


function comp() {
  const r = ref([{id:1},{id:1},{id:1}]);
  return {
    tag: "div",
    props: {
      "class": "my-block",
      "@click": () => {r.value[0] = {id:2};}
    },
    child: r.forList((e, i) => {
      // console.log(e, i);
    })
  }
}

describe("test refA", () => {
  test('should first', () => {
    const one = ref(new Array(3).fill(0).map((e, i) => ({id: i +1, v: null})));
    const second = ref([]);

    one.forList((e) => { return { tag: "div", child: e.id } });
    second.forList((e) => e);

    one.value[0] = { id:1, v: 1 };
    second.value.push(one.value.slice(0));

    one.value[1] = { id:2, v:2 };
    second.value.push(one.value.slice(0));

    expect(second.value).toStrictEqual([
      [{id: 1, v: 1},{id: 2, v: null},{id: 3, v: null}],
      [{id: 1, v: 1},{id: 2, v: 2},{id: 3, v: null}]
    ]);
  });

  test("check forList", () => {
    document.body.innerHTML = `<div id = "app"></div>`;
    createApp(comp).mount("#app");
    (document.body.querySelector(".my-block") as any).click();
  })
})