import {RectangleOptions} from "./rectangle.options";

export class Connector {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _element: HTMLElement,
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get element(): HTMLElement {
    return this._element;
  }
}


export class Rectangle {
  #connectors: Connector[] = [];

  constructor(private readonly _id: string,
              private readonly _options: RectangleOptions,
              private readonly _element: HTMLElement) {}

  get id(): string {
    return this._id;
  }

  get options(): RectangleOptions {
    return this._options;
  }

  get connectors(): Connector[] {
    return this.#connectors;
  }

  get element(): HTMLElement {
    return this._element;
  }

  addConnector(connector: Connector) {
    this.#connectors.push(connector);
  }

  removeConnector(connector: Connector) {
    this.#connectors = this.#connectors.filter(c => c.id !== connector.id);
  }
}
