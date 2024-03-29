import e from "./error";

import { ProxyType, RefAProxy } from "./type";
import { parseChildren } from "../dom/builder/children";
import { childF } from "../dom/mount/child";
import { HookObject } from "../dom/types";
import { Orve } from "../default";
import { generationID } from "../usedFunction/keyGeneration";
// import { mountedNode } from "../dom/mount/index";
import { UtilsRefA } from "./type";

function updated(obj: any) {
  if (obj.parentNode && obj.parentNode.hooks && obj.parentNode.hooks.updated) {
    obj.parentNode.hooks.updated({
      context: Orve.context,
      oNode: obj,
    } as HookObject);
  }
}

function parentCall(obj: RefAProxy) {
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

function removeFragmentNode(render: any[] ): any {
  let quee: any = [ ...render];

  while (quee.length > 0) {
    const item = quee.shift();

    if (item.tag === "fragment" && item.child.length > 0) {
      quee = [...item.child ,...quee];
      continue;
    }

    if (quee.length === 0) {
      return item.node;
    } else {
      item.node.remove();
    }
  }
}

function removeFragmentNodeAll(render: any[] ): any {
  let quee: any = [ ...render];

  while (quee.length > 0) {
    const item = quee.shift();

    if (item.tag === "fragment" && item.child.length > 0) {
      quee = [...item.child ,...quee];
      continue;
    }

    item.node.remove();
  }
}

function insertFragmentNodeWithFirstReplace(render: any[], first: any) {
  let quee: any = [ ...render ];
  let node: any = first;
  let f = true;

  while(quee.length !== 0) {
    const item = quee.shift();

    if (item.tag === "fragment" && item.child.length > 0) {
      quee = [...item.child, ...quee];
      continue;
    }

    if (f) {
      node.replaceWith(item.node);
      f = false;
    } else {
      node.after(item.node);
    }
    node = item.node;
  }
}

function insertFragmentNode(render: any[], item: any) {
  let quee: any = [ ...render];
  let node = item;
  while(quee.length !== 0) {
    const item = quee.shift();

    if (item.tag === "fragment" && item.child.length > 0) {
      quee = [...item.child, ...quee];
      continue;
    }
    if (item.node !== null) {
      node.after(item.node);
      node = item.node;
    }
  }
}

function getLastFragmentNode(render: any[]) {
  let quee: any = [ ...render ];
  let node;
  while(quee.length !== 0) {
    const item: any = quee.shift();
    if (item.tag === "fragment" && item.child.length > 0) {
      quee = [...item.child, ...quee];
      continue;
    }
    if (item.node !== null)
      node = item.node
  }
  return node;
}

function fragmentWorker(m: any, e:any ,t: RefAProxy, p: number) { 
  let lastItem: any;
  if (e.render[p].tag === UtilsRefA.Fragment) {
    lastItem = removeFragmentNode(e.render[p].child);
  } else {
    lastItem = e.render[p].node;
  }

  if (m.tag === UtilsRefA.Fragment) {
    insertFragmentNodeWithFirstReplace(m.child, lastItem)
    e.render[p] = m;
  } else {
    lastItem.replaceWith(m.node);
    e.render[p] = m;
  }
}


function replaceArrayValueOnExist(e:any ,t: RefAProxy, p: number, v: any) {
  const replaceValue = e.formate(v, p);

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

  if (e.render === null || e.render[p] === undefined) {
    insertInArrayNewValueOnExist(e, t, p, v);
  } else {
    if (mounterItem.tag === UtilsRefA.Fragment) {
      fragmentWorker(mounterItem, e, t, p);
    } else {
      e.render[p].node.replaceWith(mounterItem.node);
      e.render[p] = mounterItem;
    }
    updated(t);
  }
}

/**
 * Добавляет всем parent элемент
 */
function insertInArrayNewValue(t: RefAProxy, p: number, v: any) {
  const parent = t.parent;

  parent.forEach((e) => {
    if (e.formate === undefined) return;

    if (e.render === null) return;
    
    const newValue = e.formate(v, p);
    const builderStep = parseChildren.call(Orve.context, [newValue], null, t.parentNode as any, true);

    if (builderStep[0] === undefined) {
      console.error("error build");
      return;
    }

    const mounterStep = childF(null, builderStep);
    const mounterItem = mounterStep[0];

    if (!Array.isArray(e.render)) {
      if (mounterItem.tag === UtilsRefA.Fragment) {
        insertFragmentNodeWithFirstReplace(mounterItem.child, e.render);

        e.render = [ mounterItem ];
      } else {
        e.render.replaceWith(mounterItem.node);
        e.render = [mounterItem];
      }
      t.empty = false;
      updated(t);
    } else {
      if (mounterItem.tag === UtilsRefA.Fragment) {
        const node: any = getLastFragmentNode(e.render);
        
        insertFragmentNode(mounterItem.child, node);
        e.render.push(mounterItem);
      } else {
        const element = e.render[e.render.length - 1].node;
        element.after(mounterItem.node);
        e.render.push(mounterItem);
      }
      updated(t);
    }
  })
}

/**
 *  Добавляет в конкретного parent новый элемент
 * @param e 
 * @param t 
 * @param p 
 * @param v 
 * @returns 
 */
function insertInArrayNewValueOnExist(e: Record<string, any>, t: RefAProxy, p: number, v: any) {
  const newValue = e.formate(v, p);
  const builderStep = parseChildren.call(Orve.context, [newValue], null, t.parentNode as any, true);

  if (builderStep[0] === undefined) {
    console.error("error build");
    return;
  }

  const mounterStep = childF(null, builderStep);

  const mounterItem = mounterStep[0];

  if (!Array.isArray(e.render)) {
    if (mounterItem.tag === UtilsRefA.Fragment) {
      insertFragmentNodeWithFirstReplace(mounterItem, e.render);
      e.render = [ mounterItem ];
    } else {
      e.render.replaceWith(mounterItem.node);
      e.render = [mounterItem];
    }
    t.empty = false;
  } else {
    if (mounterItem.tag === UtilsRefA.Fragment) {
      const node: any = getLastFragmentNode(e.render);
      insertFragmentNode(mounterItem.child, node);
      e.render.push(mounterItem);
    } else {
      const element = e.render[e.render.length - 1].node;
      element.after(mounterItem.node);
      e.render.push(mounterItem);
    }
  }
  updated(t);
}

function deletePartArrayByIndex(object: RefAProxy, index: number): void {
  const parent = object.parent;

  parent.forEach((e) => {
    if (e.formate === undefined) return;

    if (e.render !== null && e.render.length !== 0 && Array.isArray(e.render)) {
      if (e.render.length === 1) {
        const comment = document.createComment(
          ` array ${object.keyNode} `,
        );

        if (e.render[0].tag === UtilsRefA.Fragment) {
          removeFragmentNodeAll(e.render[0].child);
        } else {
          e.render[0].node.replaceWith(comment);
        }
        e.render = comment;
      } else {
        if (e.render[index].tag === UtilsRefA.Fragment) {
          removeFragmentNodeAll(e.render[index].child);
          e.render[index] = undefined;
        } else {
          e.render[index].node.remove();
          e.render[index] = undefined;
        }
      }
  
      if (Array.isArray(e.render)) {
        e.render = e.render.filter((x: any) => x !== undefined);
      }
    }
  })
}

function deletePartArrayByIndexOnExist(e: any, object: RefAProxy, index: number): void {
  if (e.render !== null && e.render.length !== 0 && Array.isArray(e.render)) {
    if (e.render.length === 1) {
      const comment = document.createComment(
        ` array ${object.keyNode} `,
      );

      if (e.render[0].tag === UtilsRefA.Fragment) {
        removeFragmentNodeAll(e.render[0].child);
      } else {
        e.render[0].node.replaceWith(comment);
      }
      e.render = comment;
    } else {
      if (e.render[index].tag === UtilsRefA.Fragment) {
        removeFragmentNodeAll(e.render[index].child);
        e.render[index] = undefined;
      } else {
        e.render[index].node.remove();
        e.render[index] = undefined;
      }
    }

    if (Array.isArray(e.render)) {
      e.render = e.render.filter((x: any) => x !== undefined);
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
            const cl = Array.prototype[p].apply(t, args);
            parentCall(object);
            return cl;
          }
        }
        if (['shift'].includes(p)) {
          return function () {
            deletePartArrayByIndex(object, 0);

            // eslint-disable-next-line prefer-rest-params
            const el = Array.prototype[p].apply(t, arguments);
            updated(object);
            parentCall(object);
            return el;
          }
        }
        if (['pop'].includes(p)) {
          return function () {
            const parent = object.parent;

            parent.forEach((e) => {
              if (e.formate === undefined) return;
              if (e.render === null) return;

              deletePartArrayByIndexOnExist(e, object, e.render.length - 1);
            })

            // eslint-disable-next-line prefer-rest-params
            const el = Array.prototype[p].apply(t, arguments);
            updated(object);
            parentCall(object);
            return el;
          }
        }
        if (['splice'].includes(p)) {
          return function (...args: number[]) {
            const deletedIndex: any[] = [];

            for(let i = args[0]; i !== args[0] + args[1]; i++) {
              deletedIndex.push(i);
            }

            if (deletedIndex.length > 0) {
              const parent = object.parent;

              parent.forEach((par) => {
                if (par.formate === undefined) return;

                if (par.render !== null && par.render.length !== 0) {
                  deletedIndex.forEach((e) => {
                    if (par.render[e] !== undefined) {
                      if (par.render.length === 1) {
                        const comment = document.createComment(
                          ` array ${object.keyNode} `,
                        );

                        if (par.render[0].tag === UtilsRefA.Fragment) {
                          const lastNode = getLastFragmentNode(par.render[0].child);

                          removeFragmentNodeAll(par.render[0].child);
                          lastNode.replaceWith(comment);      
                        } else {
                          par.render[0].node.replaceWith(comment);
                        }
                        par.render = comment;
                      } else {
                        par.render[e].type = "DELETED";
                      }
                    }
                  });
                  
                  if (Array.isArray(par.render)) {
                    let newRender: any = [];
                    const lastIndex = par.render.length - 1;
  
                    par.render.forEach((e: any, i: number) => {
                      if (e.type !== "DELETED") {
                        newRender.push(e);
                      } else if (i === lastIndex && newRender.length === 0) {
                        const comment = document.createComment(
                          ` array ${object.keyNode} `,
                        );
                        
                        if (e.tag === UtilsRefA.Fragment) {
                          const lastNode = getLastFragmentNode(par.render[0].child);

                          removeFragmentNodeAll(par.render[0].child);
                          lastNode.replaceWith(comment);
                        } else {
                          e.node.replaceWith(comment);
                          newRender = comment;
                        }
                        object.empty = true;
                      } else {
                        if (e.tag === UtilsRefA.Fragment) {
                          removeFragmentNodeAll(e.child)
                        } else {
                          e.node.remove();
                        }
                      }
                    });
  
                    par.render = newRender;
                  }
                }
              })
            }
            const el = Array.prototype[p].apply(t, args);
            updated(object);
            parentCall(object);
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

      const parent = object.parent;

      parent.forEach((e) => {
        if (e.formate === undefined) return;
        if (e.render === null) return;

        if (!Number.isNaN(num) && Array.isArray(e.render) && num < e.render.length) {
          replaceArrayValueOnExist(e, object, num, v);
        } else if (!Number.isNaN(num)) {
          insertInArrayNewValueOnExist(e, object, num, v);
        }
      })
      
      updated(object);
      parentCall(object);
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
    empty: true, // пустой ли массив
    forList: function(func = null) {
      if (func !== null && typeof func === "function") {
        return {
          type: "for",
          formate: func,
          proxy: this
        };
      } else {
        console.warn("* forList need function *");
      }
      return this
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

        const parent = object.parent;

        parent.forEach((par) => {
          if (par.formate === undefined) return;

          const render = par.render;
          if (render !== null) {
            if (Array.isArray(render) && render.length > 0) {
              const lastItem = render[render.length - 1];
              render.forEach((e: any, i) => {
                if (i !== render.length - 1) {
                  if (e.tag === UtilsRefA.Fragment) {
                    removeFragmentNodeAll(e.child)
                  } else {
                    e.node.remove();
                  }
                  render[i] = undefined;
                }
              });
              par.render = lastItem.tag === UtilsRefA.Fragment
                ? removeFragmentNode(lastItem.child)
                : lastItem.node;
            }
            
            const val = v.map((e: any, i: number) => {
              return par.formate(e, i);
            })

            const builderStep = parseChildren.call(Orve.context, val, null, t.parentNode as any, true);

            if (builderStep.length === 0) {
              console.error("bad work in value");
            }
            const mounterStep = childF(null, builderStep);

            if (mounterStep.length > 0) {
              mounterStep.forEach((e: any) => {
                if (!Array.isArray(par.render)) {
                  if (e.tag === UtilsRefA.Fragment) {
                    insertFragmentNodeWithFirstReplace(e.child, par.render);
                  } else {
                    par.render.replaceWith(e.node);
                  }
                  par.render = [ e ];
                } else {
                  const lastItem = par.render[par.render.length - 1].tag === UtilsRefA.Fragment 
                    ? getLastFragmentNode(par.render[par.render.length - 1].child)
                    : par.render[par.render.length - 1].node;

                  if (e.tag === UtilsRefA.Fragment) {
                    insertFragmentNode(e.child, lastItem);
                    par.render.push(e);
                  } else {
                    lastItem.after(e.node);
                    par.render.push(e);
                  }
                }
              });
            }
          }
        })
        updated(object);
        parentCall(object);
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
