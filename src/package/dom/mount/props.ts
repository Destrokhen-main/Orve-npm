import reactToCSS from 'style-object-to-css-string';
import { ProxyType, Proxy, RefProxy, UtilsRef } from "../../reactive/type";
import { PropsTypeRef, PropRef } from "../../reactive/ref";
import { Effect } from '../../reactive/effect';
import e from "./error";

import { typeOf } from "../../usedFunction/typeOf";
import { formatedRef } from './child';

interface IMG {
  default: string;
};

function checkerEffect(item: Effect)  {
  if (item.func !== undefined) {
    const call = item.func();
    if (call === undefined) {
      e("Effect return undefined");
    }
    return call;
  } else {
    e(`${item} not a effect`);
  }
}

export const propsF = function (
  tag: HTMLElement,
  props: Record<
    string,
    string | number | (() => any) | IMG | Record<string, number | string | any>
  >,
) {
  Object.keys(props).forEach((prop: string) => {
    if (prop === "src") {
      if (typeof props[prop] === "string") {
        tag.setAttribute(prop, String(props[prop]));
      } else if (typeOf(props[prop]) === "object" && (props[prop] as Record<string, any>).default !== undefined) {
        tag.setAttribute(prop, String((props[prop] as IMG).default));
      } else if (typeOf(props[prop]) === ProxyType.Proxy) {
        const type = (props[prop] as Proxy).proxyType;
        if (type === ProxyType.Effect) {
          const effect: Effect = props[prop] as Effect;

          const call = checkerEffect(effect);
          effect.value = call;

          if (typeof call === "string") {
            tag.setAttribute(prop, call);
          } else if (typeof call === "object") {
            tag.setAttribute(prop, String(call.default));
          }

          effect.parent.push({
            key: prop,
            type: PropsTypeRef.EffectImg,
            ONode: this.ONode
          });
        }
        if (type === ProxyType.Ref) {
          let value: string | number | (() => any) | null = (props[prop] as RefProxy).value;
          if (typeof value === "function") {
            try {
              value = value.call(this.context);
            } catch(error) {
              console.error(`${value} - return error`);
              value = null;
            }
          }
          if (value !== null) {
            (props[prop] as RefProxy).parent.push({
              key: prop,
              type: PropsTypeRef.PropStatic,
              ONode: this.ONode,
            });
            tag.setAttribute(prop, String(value))
          }
        }
      }
      return;
    }
    if (prop.startsWith("@") || prop.startsWith("on")) {
      let name;
      if (prop.startsWith("@")) {
        name = prop.replace("@", "").toLowerCase().trim();
      } else {
        name = prop.replace("on", "").toLowerCase().trim();
      }

      if (typeof props[prop] === "object" && (props[prop] as any).type === UtilsRef.Format) {
        const proxy = (props[prop] as any).proxy;

        const value = formatedRef(props[prop], proxy.value);

        tag.addEventListener(name, value);
        proxy.parent.push({
          key: name,
          type: PropsTypeRef.PropEvent,
          formate: (props[prop] as any).formate,
          ONode: this.ONode,
          lastCall: value
        })
        return;
      }

      if (
        typeof props[prop] === "object" &&
        (props[prop] as any).type === ProxyType.Proxy
      ) {
        const type = (props[prop] as any).proxyType;
        if (type === ProxyType.Ref) {
          tag.addEventListener(name, (props[prop] as any).value);
          (props[prop] as any).parent.push({
            key: name,
            type: PropsTypeRef.PropEvent,
            ONode: this.ONode,
          } as PropRef);
        }

        if (type === ProxyType.Effect) {
          const call = checkerEffect(props[prop] as Effect);

          if (typeof call !== "function") {
            e("Effect in event return not a function");
          }

          tag.addEventListener(name, call);

          (props[prop] as any).value = call;

          (props[prop] as any).parent.push({
            key: name,
            type: PropsTypeRef.PropEvent,
            ONode: this.ONode,
          });
          return;
          // TODO Написать логику
        }
        // NOTE EFFECT
      } else {
        // not a proxy
        const func = (props[prop] as () => any).bind(this.context);
        tag.addEventListener(name, func);
      }
      return;
    }

    if (prop === "style") {
      if (typeof props[prop] === "object" && (props[prop] as any).type === UtilsRef.Format) {
        const proxy = (props[prop] as any).proxy;

        const value = formatedRef(props[prop], proxy.value);

        tag.setAttribute("style", value);
        proxy.parent.push({
          key: "style",
          type: PropsTypeRef.PropStatic,
          formate: (props[prop] as any).formate,
          ONode: this.ONode,
          lastCall: value
        })
        return;
      }

      if (
        typeof props[prop] === "object" &&
        (props[prop] as any).type === ProxyType.Proxy
      ) {
        const type = (props[prop] as any).proxyType;
        if (type === ProxyType.Ref) {
          tag.setAttribute("style", (props[prop] as any).value);
          (props[prop] as any).parent.push({
            key: prop,
            type: PropsTypeRef.PropStatic,
            ONode: this.ONode,
          } as PropRef);
        }

        if (type === ProxyType.Effect) {
          const call = checkerEffect(props[prop] as Effect);
          let style = "";
          if (typeof call === "string") {
            style = call;
          } else if (typeof call === "object") {
            style = reactToCSS(call);
          }

          tag.setAttribute("style", style);
          (props[prop] as any).value = style;
          (props[prop] as any).parent.push({
            key: prop,
            type: PropsTypeRef.EffectStyle,
            ONode: this.ONode,
          } as PropRef);
        }
      } else {
        // not a proxy
        let style = "";
        if (typeof props[prop] === "string") {
          style = props[prop] as string;
        } else {
          style = reactToCSS(props[prop]);
        }
        if (style.length > 0) {
          tag.setAttribute("style", style);
        }
      }
      return;
    }

    // check if PROXY
    if (
      typeof props[prop] === "object" &&
      (props[prop] as any).type === ProxyType.Proxy
    ) {
      const proxyType = (props[prop] as any).proxyType;
      if (proxyType === ProxyType.Ref) {
        let value = (props[prop] as any).value;
        if (typeof value === "function") {
          value = value();
        }
        if (prop === "value") {
          (tag as HTMLInputElement).value = value;
        } else {
          tag.setAttribute(prop, value);
        }
        (props[prop] as any).parent.push({
          key: prop,
          type: PropsTypeRef.PropStatic,
          ONode: this.ONode,
        } as PropRef);
      }
      if (proxyType === ProxyType.Effect) {
        const call = checkerEffect(props[prop] as Effect);

        const type = typeOf(call);

        if (type === "string" || type === "number") {
          tag.setAttribute(prop, call);
          (props[prop] as any).value = call;

          (props[prop] as any).parent.push({
            key: prop,
            type: PropsTypeRef.PropStatic,
            ONode: this.ONode,
          });
        }
      }
      return;
    }

    if (typeof props[prop] === "object" && (props[prop] as Record<string, any>).type === UtilsRef.Format) {
      const proxy = (props[prop] as any).proxy;
      let value = formatedRef(props[prop], proxy.value);
      if (typeof value === "function") {
        value = value();
      }
      if (prop === "value") {
        (tag as HTMLInputElement).value = value;
      } else {
        tag.setAttribute(prop, value);
      }
      proxy.parent.push({
        key: prop,
        type: PropsTypeRef.PropStatic,
        formate: (props[prop] as any).formate,
        ONode: this.ONode,
      } as PropRef);
      return;
    }

    // not all before
    tag.setAttribute(prop, props[prop] as string);
  });
};

export { checkerEffect };
