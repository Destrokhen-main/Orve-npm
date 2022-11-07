"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.ProxyType = void 0;
var ProxyType;
(function (ProxyType) {
    ProxyType[ProxyType["proxySimple"] = 0] = "proxySimple";
    ProxyType[ProxyType["proxyComponent"] = 1] = "proxyComponent";
    ProxyType[ProxyType["proxyEffect"] = 2] = "proxyEffect";
    ProxyType[ProxyType["proxyObject"] = 3] = "proxyObject";
})(ProxyType || (ProxyType = {}));
exports.ProxyType = ProxyType;
var Type;
(function (Type) {
    Type[Type["NotMutable"] = 0] = "NotMutable";
    Type[Type["Mutable"] = 1] = "Mutable";
    Type[Type["Component"] = 2] = "Component";
    Type[Type["Layer"] = 3] = "Layer";
    Type[Type["HTMLCode"] = 4] = "HTMLCode";
    Type[Type["ComponentMutable"] = 5] = "ComponentMutable";
    Type[Type["Proxy"] = 6] = "Proxy";
    Type[Type["ProxyComponent"] = 7] = "ProxyComponent";
    Type[Type["ProxyEffect"] = 8] = "ProxyEffect";
})(Type || (Type = {}));
exports.Type = Type;
//# sourceMappingURL=type.js.map