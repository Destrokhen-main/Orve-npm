import e from "./error";

import { ProxyType, RefAProxy } from "./type";
import { parseChildren } from "../dom/builder/children";
import { childF } from "../dom/mount/child";
import { HookObject } from "../dom/types";
import { Orve } from "../default";
import { generationID } from "../usedFunction/keyGeneration";
// import { mountedNode } from "../dom/mount/index";

function updated(obj: any) {
  if (obj.parentNode && obj.parentNode.hooks && obj.parentNode.hooks.updated) {
    obj.parentNode.hooks.updated({
      context: Orve.context,
      oNode: obj,
    } as HookObject);
  }
}

// function parentCall(obj: any) {
//   if (obj.parent.length > 0) {
//     obj.parent.forEach((item: any) => {
//       if (item.type === ProxyType.Watch) {
//         (item as any).value.updated(obj.value, undefined);
//         return;
//       }
//       if (item.type === "Custom") {
//         item.value(obj);
//       }
//       if (item.type === ProxyType.Effect || item.type === ProxyType.Oif) {
//         item.value.updated();
//       }
//     });
//   }
// }

function renderHelper(t: RefAProxy, p: number, v: any) {
  let replaceValue = v;

  if (t.renderFunction !== null) {
    replaceValue = t.renderFunction(v, p);
  }
  return replaceValue;
}

function replaceArrayValue(t: RefAProxy, p: number, v: any) {
  const replaceValue = renderHelper(t, p, v);

  //const renderItem = t.render[p];

  const builderStep = parseChildren.call(Orve.context, [replaceValue], null, t.parentNode as any, true);
  
  if (builderStep[0] === undefined) {
    console.error("error build");
    return;
  }

  const mounterStep = childF(null, builderStep);

  if (mounterStep[0] === undefined) {
    console.error("error mounted");
    return;
  }

  const mounterItem = mounterStep[0];

  if (t.render === null || t.render[p] === undefined) {
    insertInArrayNewValue(t, p, v);
  } else {
    t.render[p].node.replaceWith(mounterItem.node);
    t.render[p] = mounterItem;
    updated(t);
  }
}

function insertInArrayNewValue(t: RefAProxy, p: number, v: any) {
  const replaceValue = renderHelper(t, p, v);

  const builderStep = parseChildren.call(Orve.context, [replaceValue], null, t.parentNode as any, true);
  
  if (builderStep[0] === undefined) {
    console.error("error build");
    return;
  }

  const mounterStep = childF(null, builderStep);

  if (mounterStep[0] === undefined) {
    console.error("error mounted");
    return;
  }

  const mounterItem = mounterStep[0];

  if (!Array.isArray(t.render)) {
    t.render.replaceWith(mounterItem.node);
    t.render = [mounterItem];
    t.empty = false;
    updated(t);
  } else {
    const element = t.render[t.render.length - 1].node;
    element.after(mounterItem.node);
    t.render.push(mounterItem);
    updated(t);
  }
}

function deletePartArrayByIndex(object: RefAProxy, index: number): void {
  if (object.render !== null && object.render.length !== 0 && Array.isArray(object.render)) {
    if (object.render.length === 1) {
      const comment = document.createComment(
        ` array ${object.keyNode} `,
      );
      object.render[0].node.replaceWith(comment);
      object.render = comment;
    } else {
      object.render[index].node.remove();
      object.render[index] = undefined;
    }

    if (Array.isArray(object.render)) {
      object.render = object.render.filter((x: any) => x !== undefined);
    }
  }
}

function createReactiveArray(ar: any[], object: RefAProxy) {
  return new Proxy(ar, {
    get(t: any[], p: any) {
      const val = t[p];
      if (typeof val === "function") {
        if (['push', 'unshift'].includes(p)) {
          return function () {
            // eslint-disable-next-line prefer-rest-params
            const args = arguments;

            const newArgs = [];

            for(let i = 0; i !== args.length; i++) {
              newArgs.push(args[i]);
            }

            for (let i = 0; i !== newArgs.length; i++) {
              insertInArrayNewValue(object, t.length + i, newArgs[i]);
            }
            updated(object);
            return Array.prototype[p].apply(t, args);
          }
        }
        if (['shift'].includes(p)) {
          return function () {
            deletePartArrayByIndex(object, 0);

            // eslint-disable-next-line prefer-rest-params
            const el = Array.prototype[p].apply(t, arguments);
            updated(object);
            return el;
          }
        }
        if (['pop'].includes(p)) {
          // последнего
          return function () {
            deletePartArrayByIndex(object, object.render.length - 1);

            // eslint-disable-next-line prefer-rest-params
            const el = Array.prototype[p].apply(t, arguments);
            updated(object);
            return el;
          }
        }
        if (['splice'].includes(p)) {
          return function (...args: number[]) {
            const deletedIndex = [];

            for(let i = args[0]; i !== args[0] + args[1]; i++) {
              deletedIndex.push(i);
            }
            if (deletedIndex.length > 0 && object.render !== null && object.render.length !== 0) {
              deletedIndex.forEach((e) => {
                if (object.render[e] !== undefined) {
                  if (object.render.length === 1) {
                    const comment = document.createComment(
                      ` array ${object.keyNode} `,
                    );
                    object.render[0].node.replaceWith(comment);
                    object.render = comment;
                  } else {
                    object.render[e].type = "DELETED";
                  }
                }
              });
              
              if (Array.isArray(object.render)) {
                let newRender: any = [];
                const lastIndex = object.render.length - 1;

                object.render.forEach((e, i) => {
                  if (e.type !== "DELETED") {
                    newRender.push(e);
                  } else if (i === lastIndex && newRender.length === 0) {
                    const comment = document.createComment(
                      ` array ${object.keyNode} `,
                    );
                    e.node.replaceWith(comment);
                    newRender = comment;
                    object.empty = true;
                  } else {
                    e.node.remove();
                  }
                });

                object.render = newRender;
              }
            }

            const el = Array.prototype[p].apply(t, args);
            updated(object);
            return el;
          }
        }
        return val.bind(t);
      }
      return Reflect.get(t, p);
    },
    set(t: any[], p: string, v: any) {
      const s = Reflect.set(t, p, v);
      const num = parseInt(p, 10);

      if (!Number.isNaN(num) && Array.isArray(object.render) && num < object.render.length) {
        replaceArrayValue(object, num, v);
      } else if (!Number.isNaN(num)) {
        insertInArrayNewValue(object, num, v);
      }
      updated(object);
      return s;
    }
  });
}

function refA(ar: Array<any>) {
  if (!Array.isArray(ar)) {
    e("refA - need array");
  }

  const object: RefAProxy = {
    parent: [], 
    value: null, // proxy для массива
    render: null, // все ноды которые на экране
    empty: true, // пустой ли массив
    renderFunction: null, // forList
    forList: function(func = null) {
      if (func !== null && typeof func === "function") {
        this.renderFunction = func;
      } else {
        console.warn("* forList need function *");
      }
      return this;
    },
    type: ProxyType.Proxy,
    proxyType: ProxyType.RefA,
    parentNode: null,
    keyNode: generationID(8)
  };

  const array = createReactiveArray(ar, object);

  object.value = array;
  object.empty = array.length === 0;

  return new Proxy(object, {
    set(t: RefAProxy, p: string, v: any) {
      if (p === "value") {
        if (!Array.isArray(v)) {
          console.error("refA wanted array");
          return false;
        }
        t.value = createReactiveArray(v, t);
        const render = t.render;
        if (render !== null && Array.isArray(render) && render.length > 0) {
          const lastItem = render[render.length - 1];
          render.forEach((e: any, i) => {
            if (i !== render.length - 1) {
              e.node.remove();
              render[i] = undefined;
            }
          });
          object.render = lastItem.node;

          const val = v.map((e: any, i: number) => {
            return renderHelper(t, i, e);
          })

          const builderStep = parseChildren.call(Orve.context, val, null, t.parentNode as any, true);

          if (builderStep.length === 0) {
            console.error("bad work in value");
          }

          const mounterStep = childF(null, builderStep);

          if (mounterStep.length > 0) {
            mounterStep.forEach((e: any) => {
              if (!Array.isArray(object.render)) {
                object.render.replaceWith(e.node);
                object.render = [ e ];
              } else {
                const lastItem = object.render[object.render.length - 1].node;
                lastItem.after(e.node);
                object.render.push(e);
              }
            });
          }
        }
        return true;
      }
      return Reflect.set(t, p, v);
    },
    deleteProperty() {
      console.error("refA - You try to delete prop in ref");
      return false;
    },
  })
}

export { refA };
