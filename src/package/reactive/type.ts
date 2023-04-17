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
};

interface RefCProxy extends Proxy {
  parent: Array<any>;
  value: () => any;
};

interface RefOProxy extends Proxy {
  $parent: Array<any>;
};

export { ProxyType, RefLProxy, RefProxy, PropsStartType, RefCProxy, RefOProxy, Proxy };
