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
    this.#connectors = [];
  }
  #connectors;
  get id() {
    return this._id;
  }
  get options() {
    return this._options;
  }
  get connectors() {
    return this.#connectors;
  }
  get element() {
    return this._element;
  }
  addConnector(connector) {
    this.#connectors.push(connector);
  }
  removeConnector(connector) {
    this.#connectors = this.#connectors.filter((c) => c.id !== connector.id);
  }
}
