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
  render: (() => string | number) | null,
  format: (func: () => string | number) => any
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
  render: any,
  empty: boolean,
  renderFunction: ((item?: any, index?: number) => any) | null,
  forList: () => this,
  parentNode: Record<string, any> | null,
  keyNode: string
}

export { ProxyType, RefLProxy, RefProxy, PropsStartType, RefCProxy, RefOProxy, Proxy, RefAProxy, ReactiveParams };
