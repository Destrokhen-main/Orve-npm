import e from "./error";

import { ProxyType } from "./type";
import { parseChildren } from "../dom/builder/children";
import { childF } from "../dom/mount/child";
import { HookObject } from "../dom/types";

function updated(obj: any) {
  if (obj.parentNode && obj.parentNode.hooks && obj.parentNode.hooks.updated) {
    obj.parentNode.hooks.updated({
      context: window.orve.context,
      oNode: obj,
    } as HookObject);
  }
}

function parentCall(obj: any) {
  if (obj.parent.length > 0) {
    obj.parent.forEach((item: any) => {
      if (item.type === ProxyType.Watch) {
        (item as any).value.updated(obj.value, undefined);
        return;
      }
    });
  }
}

function newValueInsert(obj: Record<string, any>, value: any) {
  const newItem = parseChildren.call(
    window.orve.context,
    [value],
    null,
    obj.parentNode,
    true,
  );
  const Item = childF.call(window.orve.context, null, newItem);
  if (obj.empty) {
    obj.render.replaceWith(Item[0].node);
    obj.render = Item;
    obj.empty = false;
    updated(obj);
  } else {
    const element = obj.render[obj.render.length - 1].node;
    element.after(Item[0].node);
    obj.render.push(Item[0]);
    updated(obj);
    parentCall(obj);
  }
}

function replaceValue(obj: Record<string, any>, prop: string, value: any) {
  const newItem = parseChildren.call(
    window.orve.context,
    [value],
    null,
    obj.parentNode,
    true,
  );
  const Item = childF.call(window.orve.context, null, newItem);
  obj.render[prop].node.replaceWith(Item[0].node);
  obj.render[prop] = Item[0];
  updated(obj);
  parentCall(obj);
}

function checkOutAndInput(obj) {
  if (obj.value.length > 0 && obj.value.length !== obj.render.length) {
    const newItem = parseChildren.call(
      window.orve.context,
      [obj.value],
      null,
      obj.parentNode,
      true,
    );
    const newRender = obj.render.map((ren, i) => {
      if (newItem[i] === undefined) {
        ren.node.remove();
        return undefined;
      }
      return ren;
    });
    obj.render = newRender.filter((i) => i !== undefined);
    updated(obj);
    parentCall(obj);
  } else if (obj.value.length === 0 && Array.isArray(obj.render)) {
    const element = document.createComment(` array ${obj.keyNode} `);
    obj.render[0].node.replaceWith(element);
    obj.render = element;
    obj.empty = true;
    updated(obj);
    parentCall(obj);
  }
}

function refA(ar: Array<any>) {
  if (!Array.isArray(ar)) {
    e("refA - need array");
  }
  const object = {
    parent: [],
    value: null,
    render: null,
    empty: null,
  };

  let checkAr = null;
  let mutationArray = false;
  const array = new Proxy(ar, {
    get(target, prop, r) {
      const v = Reflect.get(target, prop, r);
      if (prop === "constructor") {
        mutationArray = true;
        setTimeout(() => {
          checkOutAndInput(object);
          mutationArray = false;
        }, 5);
      }
      return v;
    },
    set(target, prop, value) {
      const isNum = parseInt(prop as string, 10);
      if (
        !Number.isNaN(isNum) &&
        isNum < target.length &&
        object.render !== null
      ) {
        replaceValue(object, prop as string, value);
        if (mutationArray) {
          if (checkAr !== null) clearTimeout(checkAr);
          checkAr = setTimeout(() => {
            checkOutAndInput(object);
            mutationArray = false;
          }, 1);
        }
      } else if (
        !Number.isNaN(isNum) &&
        isNum === target.length &&
        object.render !== null
      ) {
        newValueInsert(object, value);
      } else if (!Number.isNaN(isNum) && object.render === null) {
        parentCall(object);
      }

      return Reflect.set(target, prop, value);
    },
  });

  object["value"] = array;
  object["empty"] = array.length === 0;

  return new Proxy(object, {
    get(target, prop) {
      if (prop === "type") return ProxyType.Proxy;
      if (prop === "proxyType") return ProxyType.RefA;
      return Reflect.get(target, prop);
    },
    deleteProperty() {
      console.error("refA - You try to delete prop in ref");
      return false;
    },
  });
}

export { refA };
