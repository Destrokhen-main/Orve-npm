enum ProxyType {
  Proxy = "Proxy",
  RefL = "RefL",
  Ref = "Ref",
  RefF = "RefF",
  RefC = "RefC"
}

enum PropsStartType {
  Static = "Static",
  Function = "Function",
  None = "None"
}

type RefLProxy = {
  parent: Array<any>,
  value: HTMLElement | null,
  type: ProxyType,
  proxyType: ProxyType,
} 

type RefProxy = {
  parent: Array<any>,
  value: string | number | (() => any),
  type: ProxyType,
  proxyType: ProxyType,
  startType: PropsStartType
}

export { ProxyType, RefLProxy, RefProxy, PropsStartType };