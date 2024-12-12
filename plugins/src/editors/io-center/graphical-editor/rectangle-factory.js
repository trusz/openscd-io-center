import {Rectangle} from "./rectangle.js";
import {ConnectionManagerService} from "../connection-manager/connection-manager.service.js";
export class RectangleFactory {
  constructor(shadowRoot) {
    this.connectionManager = ConnectionManagerService.getInstance();
    this.shadowRoot = shadowRoot;
  }
  createRectangle(options, startConnection) {
    if (!this.shadowRoot)
      return void 0;
    const rectangle = this.createBaseRectangle(options);
    this.addHeaderToRectangle(rectangle, options);
    this.addConnectors(rectangle, options, startConnection);
    this.addActionBar(rectangle, options);
    const gridContainer = this.shadowRoot.querySelector(".grid-container");
    if (!gridContainer)
      return;
    this.positionRectangle(rectangle, gridContainer, options);
    gridContainer.appendChild(rectangle);
    return new Rectangle(options.id, options, rectangle);
  }
  createBaseRectangle(options) {
    const rectangle = document.createElement("div");
    rectangle.id = options.id;
    rectangle.classList.add("rectangle");
    const actionBarHeight = 30;
    rectangle.style.width = `${options.width}px`;
    rectangle.style.height = `${options.height + actionBarHeight}px`;
    rectangle.rectangleOptions = options;
    return rectangle;
  }
  addHeaderToRectangle(rectangle, options) {
    if (options.text) {
      const headerElement = document.createElement("div");
      headerElement.classList.add("rectangle-header");
      headerElement.textContent = options.text;
      rectangle.appendChild(headerElement);
    }
  }
  addConnectors(rectangle, options, startConnection) {
    if (options.inputConnectors) {
      options.inputConnectors.forEach((connector, index) => {
        const inputConnector = this.createConnector("input-connector", connector, index, options.inputConnectors.length);
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
        const outputConnector = this.createConnector("output-connector", connector, index, options.outputConnectors.length);
        outputConnector.addEventListener("click", () => this.deleteConnection(connector.id));
        outputConnector.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          startConnection(e, "output");
        });
        rectangle.appendChild(outputConnector);
      });
    }
  }
  deleteConnection(connectorId) {
    const connection = this.connectionManager.findConnectionToOrFromConnector(connectorId);
    if (connection) {
      this.connectionManager.deleteConnectionObjectById(connection.id);
    }
  }
  createConnector(className, connector, index, total) {
    const connectorElement = document.createElement("div");
    connectorElement.id = connector.id;
    connectorElement.classList.add("connector", className);
    this.positionConnector(connectorElement, index, total, connector.position, connector.spacing || 0);
    if (connector.text) {
      const connectorText = document.createElement("div");
      connectorText.classList.add("connector-text");
      connectorText.textContent = connector.text;
      connectorText.style.position = "absolute";
      connectorText.style.whiteSpace = "nowrap";
      connectorElement.appendChild(connectorText);
      if (connector.position === "left") {
        connectorText.style.left = "20px";
      } else if (connector.position === "right") {
        connectorText.style.right = "20px";
      } else if (connector.position === "top") {
        connectorText.style.top = "20px";
      } else if (connector.position === "bottom") {
        connectorText.style.bottom = "10px";
      }
    }
    return connectorElement;
  }
  positionConnector(connector, index, total, position, spacing = 0) {
    requestAnimationFrame(() => {
      const parentRect = connector.parentElement.getBoundingClientRect();
      const header = connector.parentElement.querySelector(".rectangle-header");
      const actionBar = connector.parentElement.querySelector(".action-bar");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const actionBarHeight = actionBar ? actionBar.getBoundingClientRect().height : 0;
      const availableHeight = parentRect.height - headerHeight - actionBarHeight;
      let connectorPosition;
      if (total === 1) {
        connectorPosition = position === "left" || position === "right" ? (availableHeight - connector.offsetHeight) / 2 + headerHeight : (parentRect.width - connector.offsetWidth) / 2;
      } else {
        const totalSpacing = spacing * (total - 1);
        const availableSpace = position === "left" || position === "right" ? availableHeight - totalSpacing : parentRect.width - totalSpacing;
        const offset = availableSpace / total;
        connectorPosition = index * (offset + spacing) + offset / 2 + headerHeight;
      }
      if (position === "left") {
        connector.style.left = "-5px";
        connector.style.top = `${connectorPosition}px`;
      } else if (position === "right") {
        connector.style.right = "-5px";
        connector.style.top = `${connectorPosition}px`;
      } else if (position === "top") {
        connector.style.top = "-5px";
        connector.style.left = `${connectorPosition}px`;
      } else if (position === "bottom") {
        connector.style.bottom = "-5px";
        connector.style.left = `${connectorPosition}px`;
      }
    });
  }
  addActionBar(rectangle, options) {
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
  positionRectangle(rectangle, container, options) {
    const margin = 10;
    const containerRect = container.getBoundingClientRect();
    const existingRectangles = Array.from(container.children);
    let x = margin;
    let y = margin;
    const rectanglesInSamePosition = existingRectangles.filter((rect) => {
      const rectOptions = rect.rectangleOptions;
      return rectOptions && rectOptions.rectanglePosition === options.rectanglePosition;
    });
    if (rectanglesInSamePosition.length > 0) {
      const lastRect = rectanglesInSamePosition[rectanglesInSamePosition.length - 1].getBoundingClientRect();
      y = lastRect.bottom - containerRect.top + margin;
    }
    switch (options.rectanglePosition) {
      case "left":
        x = margin;
        break;
      case "middle":
        x = containerRect.width / 2 - options.width / 2;
        break;
      case "right":
        x = containerRect.width - options.width - margin;
        break;
    }
    rectangle.style.position = "absolute";
    rectangle.style.left = `${x}px`;
    rectangle.style.top = `${y}px`;
  }
}
