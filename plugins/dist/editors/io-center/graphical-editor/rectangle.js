var _Rectangle_connectors;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../../../../../_snowpack/pkg/tslib.js";
export class Connector {
    constructor(_id, _name, _element) {
        this._id = _id;
        this._name = _name;
        this._element = _element;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get element() {
        return this._element;
    }
}
export class Rectangle {
    constructor(_id, _options, _element) {
        this._id = _id;
        this._options = _options;
        this._element = _element;
        _Rectangle_connectors.set(this, []);
    }
    get id() {
        return this._id;
    }
    get options() {
        return this._options;
    }
    get connectors() {
        return __classPrivateFieldGet(this, _Rectangle_connectors, "f");
    }
    get element() {
        return this._element;
    }
    addConnector(connector) {
        __classPrivateFieldGet(this, _Rectangle_connectors, "f").push(connector);
    }
    removeConnector(connector) {
        __classPrivateFieldSet(this, _Rectangle_connectors, __classPrivateFieldGet(this, _Rectangle_connectors, "f").filter(c => c.id !== connector.id), "f");
    }
}
_Rectangle_connectors = new WeakMap();
//# sourceMappingURL=rectangle.js.map