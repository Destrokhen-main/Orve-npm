enum ProxyType {
  Proxy = "Proxy",
  RefL = "RefL",
  Ref = "Ref",
  RefF = "RefF",
  RefC = "RefC",
  Watch = "Watch",
  RefO = "RefO",
  RefA = "RefA",
  Effect = "Effect",
  Oif = "Oif"
}

enum PropsStartType {
  Static = "Static",
  Function = "Function",
  None = "None",
}

interface Proxy {
  type: ProxyType;
  proxyType: ProxyType;
}

interface RefLProxy extends Proxy {
  parent: Array<any>;
  value: HTMLElement | null;
};

interface RefProxy extends Proxy {
  parent: Array<any>;
  value: string | number | (() => any);
  startType: PropsStartType;
  formate: (func: () => string | number) => any
};

interface RefCProxy extends Proxy {
  parent: Array<any>;
  value: () => any;
};


type ReactiveParams = {
  node: Comment | null,
  nameValue: string
};

interface RefOProxy {
  $parent: Array<any>;
  $reactiveParams: Array<ReactiveParams>;
};

interface RefAProxy extends Proxy {
  parent: any[],
  value: any,
  empty: boolean,
  forList: () => this,
  parentNode: Record<string, any> | null,
  keyNode: string,
}

export enum UtilsRef {
  Format = "format"
}

export enum UtilsRefA {
  Format = "for",
  Fragment = "fragment"
}

export { ProxyType, RefLProxy, RefProxy, PropsStartType, RefCProxy, RefOProxy, Proxy, RefAProxy, ReactiveParams };
