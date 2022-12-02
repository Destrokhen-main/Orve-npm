enum ProxyType {
  Proxy = "Proxy",
  RefL = "RefL",
  Ref = "Ref",
  RefF = "RefF"
}

type RefLProxy = {
  parent: Array<any>,
  value: HTMLElement | null,
  type: ProxyType,
  typeProxy: ProxyType,
} 

type RefProxy = {
  parent: Array<any>,
  value: string | number | (() => any),
  type: ProxyType,
  typeProxy: ProxyType
}

export { ProxyType, RefLProxy, RefProxy };