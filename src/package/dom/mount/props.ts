import reactToCSS from 'style-object-to-css-string';
import { ProxyType, Proxy } from "../../reactive/type";
import { PropsTypeRef, PropRef } from "../../reactive/ref";
import e from "./error";

import { typeOf } from "../../usedFunction/typeOf";

interface IMG {
  default: string;
};

function checkerEffect(item: Record<string, any>) {
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
          const call = checkerEffect(props[prop] as Record<string, any>);
          (props[prop] as any).value = call;

          if (typeof call === "string") {
            tag.setAttribute(prop, call);
          } else if (typeof call === "object") {
            tag.setAttribute(prop, call.default as string);
          }

          (props[prop] as any).parent.push({
            key: prop,
            type: PropsTypeRef.EffectImg,
            ONode: this.ONode
          });

        }
        if (type === ProxyType.Ref) {
          let value = (props[prop] as any).value;
          if (typeof value === "function") {
            value = value();
          }
          (props[prop] as any).parent.push({
            key: prop,
            type: PropsTypeRef.PropStatic,
            ONode: this.ONode,
          } as PropRef);
          tag.setAttribute(prop, value)
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
          const call = checkerEffect(props[prop] as Record<string, any>);

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
          const call = checkerEffect(props[prop] as Record<string, any>);
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
        const call = checkerEffect(props[prop] as Record<string, any>);

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

    // not all before

    tag.setAttribute(prop, props[prop] as string);
  });
};

export { checkerEffect };
