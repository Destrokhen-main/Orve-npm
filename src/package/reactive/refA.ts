// FIXME REF A - 3
/*
 [ ] - фрагменты плохо работают
 [ ] - проверка на существующих родителей (parentCall)
 [ ] - constructor
*/


import e from "./error";

import { ProxyType } from "./type";
import { parseChildren } from "../dom/builder/children";
import { childF } from "../dom/mount/child";
import { HookObject } from "../dom/types";
import { Orve } from "../default";
// import { mountedNode } from "../dom/mount/index";

function updated(obj: any) {
  if (obj.parentNode && obj.parentNode.hooks && obj.parentNode.hooks.updated) {
    obj.parentNode.hooks.updated({
      context: Orve.context,
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
      if (item.type === "Custom") {
        item.value(obj);
      }
      if (item.type === ProxyType.Effect || item.type === ProxyType.Oif) {
        item.value.updated();
      }
    });
  }
}

function newValueInsert(obj: Record<string, any>, value: any) {
  let val = value;

  if (obj.renderFunction !== null) {
    const index = obj.value === null || obj.value.length === 0 ? 0: obj.value.length;
    val = obj.renderFunction(val, index);
  }

  const newItem = parseChildren.call(
    Orve.context,
    Array.isArray(val) ? val : [val],
    null,
    obj.parentNode,
    true,
  );
  
  if (newItem[0].tag === "fragment") {
    //const node = mountedNode(obj.parentNode.node, newItem[0]);
  } else {
    const Item = childF.call(Orve.context, null, newItem);
    if (!Array.isArray(obj.render)) {
      obj.render.replaceWith(Item[0].node);
      obj.render = Item;
      obj.empty = false;
      updated(obj);
    } else {
      const element = obj.render[obj.render.length - 1].node;
      element.after(Item[0].node);
      obj.render.push(Item[0]);
      updated(obj);
    }
  }
}

function replaceValue(obj: Record<string, any>, prop: string, value: any) {
  let val = value;

  if (obj.renderFunction !== null) {
    val = obj.renderFunction(value, prop);
  }

  const newItem = parseChildren.call(
    Orve.context,
    Array.isArray(val) ? val : [val],
    null,
    obj.parentNode,
    true,
  );
  const Item = childF.call(Orve.context, null, newItem);
  obj.render[prop].node.replaceWith(Item[0].node);
  obj.render[prop] = Item[0];
  updated(obj);
}

function checkOutAndInput(obj) {
  if (
    obj.value.length > 0 &&
    Array.isArray(obj.render) &&
    obj.value.length !== obj.render.length
  ) {
    let val = obj.value;

    if (obj.renderFunction !== null) {
      if (Array.isArray(val)) {
        val = val.map(obj.renderFunction);
      } else {
        console.log("asd");
      }
    }

    const newItem = parseChildren.call(
      Orve.context,
      val,
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
  } else if (obj.value.length === 0 && Array.isArray(obj.render)) {
    const element = document.createComment(` array ${obj.keyNode} `);
    obj.render[0].node.replaceWith(element);
    obj.render = element;
    obj.empty = true;
    updated(obj);
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
    renderFunction: null,
    forList: function(func = null){
      if (func !== null && typeof func === "function") {
        this.renderFunction = func;
      } else {
        console.warn("* forList need function *");
      }
      return this;
    } 
  };

  let checkAr = null;
  let mutationArray = false;
  const array = new Proxy(ar, {
    get(target, prop, r) {
      if (prop === "constructor") {
        mutationArray = true;
        setTimeout(() => {
          checkOutAndInput(object);
          mutationArray = false;
        }, 5);
      }
      const v = Reflect.get(target, prop, r);
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
      }

      const s = Reflect.set(target, prop, value);
      parentCall(object);
      return s;
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
    set(target, prop, value) {
      if (prop === "value") {
        if (target["value"].length === 0) {
          value.forEach((e) => {
            target["value"].push(e);
          });
          return true;
        } else {
          if (value.length > target["value"].length) {
            value.forEach((e, i) => {
              if (target["value"][i] !== undefined) {
                target["value"][i] = e;
              } else {
                target["value"].push(e);
              }
            });
          } else if (value.length < target["value"].length) {
            target["value"].splice(0, target["value"].length);
            value.forEach((e) => {
              target["value"].push(e);
            });
          }
          return true;
        }
      }
      return Reflect.set(target, prop, value);
    },
    deleteProperty() {
      console.error("refA - You try to delete prop in ref");
      return false;
    },
  });
}

export { refA };
