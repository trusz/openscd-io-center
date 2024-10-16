import { RectangleOptions } from "./rectangle.options";
import { Connector } from "../interfaces/connector.interface";
import { Rectangle } from "./rectangle";
import {ConnectionManagerService} from "../connection-manager/connection-manager.service";

export class RectangleFactory {
  private readonly shadowRoot: ShadowRoot;

  private connectionManager = ConnectionManagerService.getInstance();

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
  }

  createRectangle(
    options: RectangleOptions,
    startConnection: (event: MouseEvent, type: "input" | "output") => void
  ): Rectangle | undefined {
    if (!this.shadowRoot) return undefined;

    const rectangle = this.createBaseRectangle(options);
    this.addHeaderToRectangle(rectangle, options);
    this.addConnectors(rectangle, options, startConnection);
    this.addActionBar(rectangle, options);

    const gridContainer = this.shadowRoot.querySelector(".grid-container");
    if (!gridContainer) return;

    this.positionRectangle(rectangle, gridContainer, options);
    gridContainer.appendChild(rectangle);

    return new Rectangle(options.id, options, rectangle);
  }

  private createBaseRectangle(options: RectangleOptions): HTMLElement {
    const rectangle = document.createElement("div");
    rectangle.id = options.id;
    rectangle.classList.add("rectangle");

    // Adjusting the height by adding space for the action bar (e.g., 30px more)
    const actionBarHeight = 30;
    rectangle.style.width = `${options.width}px`;
    rectangle.style.height = `${options.height + actionBarHeight}px`;

    (rectangle as any).rectangleOptions = options;
    return rectangle;
  }

  private addHeaderToRectangle(rectangle: HTMLElement, options: RectangleOptions) {
    if (options.text) {
      const headerElement = document.createElement("div");
      headerElement.classList.add("rectangle-header");
      headerElement.textContent = options.text;
      rectangle.appendChild(headerElement);
    }
  }

  private addConnectors(
    rectangle: HTMLElement,
    options: RectangleOptions,
    startConnection: (event: MouseEvent, type: "input" | "output") => void
  ) {
    if (options.inputConnectors) {
      options.inputConnectors.forEach((connector, index) => {
        const inputConnector = this.createConnector('input-connector', connector, index, options.inputConnectors!.length);

        inputConnector.addEventListener("click", () => this.deleteConnection(connector.id));

        inputConnector.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          startConnection(e, "input");
        });
        rectangle.appendChild(inputConnector);
      });
    }

    if (options.outputConnectors) {
      options.outputConnectors.forEach((connector, index) => {
        const outputConnector = this.createConnector('output-connector', connector, index, options.outputConnectors!.length);

        outputConnector.addEventListener("click", () => this.deleteConnection(connector.id));

        outputConnector.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          startConnection(e, "output");
        });
        rectangle.appendChild(outputConnector);
      });
    }
  }


  private deleteConnection(connectorId: string) {
    const connection = this.connectionManager.findConnectionToOrFromConnector(connectorId);
    if (connection) {
      this.connectionManager.deleteConnectionObjectById(connection.id);
    }
  }

  private createConnector(className: string, connector: Connector, index: number, total: number): HTMLElement {
    const connectorElement = document.createElement("div");
    connectorElement.id = connector.id;
    connectorElement.classList.add("connector", className);

    this.positionConnector(connectorElement, index, total, connector.position, connector.spacing || 0);

    if (connector.text) {
      const connectorText = document.createElement("div");
      connectorText.classList.add("connector-text");
      connectorText.textContent = connector.text;
      connectorText.style.position = 'absolute';
      connectorText.style.whiteSpace = 'nowrap';

      connectorElement.appendChild(connectorText);

      if (connector.position === 'left') {
        connectorText.style.left = '20px';
      } else if (connector.position === 'right') {
        connectorText.style.right = '20px';
      } else if (connector.position === 'top') {
        connectorText.style.top = '20px';
      } else if (connector.position === 'bottom') {
        connectorText.style.bottom = '10px';
      }
    }

    return connectorElement;
  }

  private positionConnector(
    connector: HTMLElement,
    index: number,
    total: number,
    position: 'left' | 'right' | 'top' | 'bottom',
    spacing: number = 0
  ) {
    requestAnimationFrame(() => {
      const parentRect = connector.parentElement!.getBoundingClientRect();

      // Get the header and action bar heights
      const header = connector.parentElement!.querySelector('.rectangle-header');
      const actionBar = connector.parentElement!.querySelector('.action-bar');

      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const actionBarHeight = actionBar ? actionBar.getBoundingClientRect().height : 0;
      const availableHeight = parentRect.height - headerHeight - actionBarHeight;

      let connectorPosition: number;

      if (total === 1) {
        connectorPosition = position === 'left' || position === 'right'
          ? (availableHeight - connector.offsetHeight) / 2 + headerHeight
          : (parentRect.width - connector.offsetWidth) / 2;
      } else {
        const totalSpacing = spacing * (total - 1);
        const availableSpace = (position === 'left' || position === 'right')
          ? availableHeight - totalSpacing
          : parentRect.width - totalSpacing;
        const offset = availableSpace / total;
        connectorPosition = index * (offset + spacing) + offset / 2 + headerHeight;
      }

      if (position === 'left') {
        connector.style.left = '-5px';
        connector.style.top = `${connectorPosition}px`;
      } else if (position === 'right') {
        connector.style.right = '-5px';
        connector.style.top = `${connectorPosition}px`;
      } else if (position === 'top') {
        connector.style.top = '-5px';
        connector.style.left = `${connectorPosition}px`;
      } else if (position === 'bottom') {
        connector.style.bottom = '-5px';
        connector.style.left = `${connectorPosition}px`;
      }
    });
  }

  addActionBar(rectangle: HTMLElement, options: RectangleOptions) {
    const actionBar = document.createElement("div");
    actionBar.classList.add("action-bar");

    if (options.onDelete) {
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<mwc-icon class="icon-delete">delete</mwc-icon>';

      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (options.onDelete) {
          options.onDelete();
        }
      });

      actionBar.appendChild(deleteButton);
    }

    if (options.onRouterAdd) {
      const routerAddButton = document.createElement("button");
      routerAddButton.innerHTML = '<mwc-icon class="icon-custom">add</mwc-icon>';

      routerAddButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (options.onRouterAdd) {
          options.onRouterAdd();
        }
      });

      actionBar.appendChild(routerAddButton);
    }

    if (options.onConnectorEdit) {
      const connectorEditButton = document.createElement("button");
      connectorEditButton.innerHTML = '<mwc-icon class="icon-custom">edit</mwc-icon>';

      connectorEditButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (options.onConnectorEdit) {
          options.onConnectorEdit();
        }
      });

      actionBar.appendChild(connectorEditButton);
    }

    rectangle.appendChild(actionBar);
  }

  private positionRectangle(rectangle: HTMLElement, container: Element, options: RectangleOptions) {
    const margin = 10; // Margin between rectangles and from the edges
    const containerRect = container.getBoundingClientRect();
    const existingRectangles = Array.from(container.children) as HTMLElement[];

    let x = margin;
    let y = margin;

    // Filter rectangles based on their intended position (left, middle, right)
    const rectanglesInSamePosition = existingRectangles.filter(rect => {
      const rectOptions = (rect as any).rectangleOptions as RectangleOptions;
      return rectOptions && rectOptions.rectanglePosition === options.rectanglePosition;
    });

    // Determine y position based on the last rectangle in the same position group
    if (rectanglesInSamePosition.length > 0) {
      const lastRect = rectanglesInSamePosition[rectanglesInSamePosition.length - 1].getBoundingClientRect();
      y = lastRect.bottom - containerRect.top + margin;
    }

    // Determine x position based on rectanglePosition
    switch (options.rectanglePosition) {
      case 'left':
        x = margin;
        break;
      case 'middle':
        x = (containerRect.width / 2) - (options.width / 2);
        break;
      case 'right':
        x = containerRect.width - options.width - margin;
        break;
    }

    // Ensure the rectangle is positioned absolutely within the container
    rectangle.style.position = 'absolute';
    rectangle.style.left = `${x}px`;
    rectangle.style.top = `${y}px`;
  }
}
