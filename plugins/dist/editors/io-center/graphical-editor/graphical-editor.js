import { __decorate } from "../../../../../_snowpack/pkg/tslib.js";
import { css, customElement, html, state } from "../../../../../_snowpack/pkg/lit-element.js";
import { IoCenterFoundation } from "../foundation.js";
import { RectangleFactory } from "./rectangle-factory.js";
import '../../../../../_snowpack/pkg/@material/mwc-icon.js';
import './action-overlay/action-overlay.js';
import '../components/icon-button.js';
import { ElementManagerService } from "../element-manager/element-manager.service.js";
import { ConnectionManagerService } from "../connection-manager/connection-manager.service.js";
let GraphicalEditor = class GraphicalEditor extends IoCenterFoundation {
    constructor() {
        super();
        this.rectangles = [];
        this.connectionMap = new Map();
        this.rectangleFactory = new RectangleFactory(this.shadowRoot);
        this.subList = [];
        this.elementManager = ElementManagerService.getInstance();
        this.connectionManager = ConnectionManagerService.getInstance();
        this.setupEventListeners();
        this.subscribeToDeletion();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.subList.forEach(sub => sub.unsubscribe());
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.subList.push(this.connectionManager.connectionAdded$.subscribe((connection) => {
            // Find the `from` and `to` elements based on connection object
            const fromElement = this.shadowRoot.getElementById(connection.sourceConnectorId);
            const toElement = this.shadowRoot.getElementById(connection.targetConnectorId);
            if (fromElement && toElement) {
                this.createConnection(fromElement, toElement, connection.id);
            }
            else {
                console.warn("Could not find elements for connection:", connection);
            }
        }));
        this.subList.push(this.connectionManager.connectionDeleted$.subscribe((connection) => {
            this.removeLine(connection.id);
        }));
        setTimeout(() => {
            this.correctInitialPositions();
        }, 10);
    }
    correctInitialPositions() {
        const gridContainer = this.shadowRoot.querySelector(".grid-container");
        if (gridContainer) {
            gridContainer.offsetHeight;
            this.updateConnections();
        }
    }
    clearAllRectangles() {
        this.connectionMap.forEach((conn, id) => {
            this.removeLine(id);
        });
        this.connectionMap.clear();
        this.rectangles.forEach(rectangle => {
            this.removeRectangle(rectangle);
        });
        this.rectangles = [];
    }
    setupEventListeners() {
        this.addEventListener('click', this.handleGridClick.bind(this));
        const gridContainer = this.shadowRoot.querySelector(".grid-container");
        if (gridContainer) {
            gridContainer.addEventListener('scroll', this.updateConnections.bind(this));
        }
    }
    subscribeToDeletion() {
        this.subList.push(this.elementManager.dataObjectDeleted$.subscribe((dataObject) => {
            this.removeRectangleById(dataObject.id);
            if (dataObject.type === 'DO') {
                this.clearAllRectangles();
                this.elementManager.clearDataObjects();
            }
        }));
    }
    handleGridClick(event) {
        if (!this.isRectangleElement(event)) {
        }
    }
    isRectangleElement(event) {
        return !!event.composedPath().find(el => el.classList?.contains('rectangle'));
    }
    addRectangle(options) {
        const rectangle = this.rectangleFactory.createRectangle(options, this.startConnection.bind(this));
        if (!rectangle || !rectangle.element) {
            console.warn("Failed to create or append rectangle");
            return;
        }
        this.positionAndAppendRectangle(rectangle, options);
        this.rectangles.push(rectangle);
        setTimeout(() => {
            this.updateConnections();
        }, 10);
    }
    positionAndAppendRectangle(rectangle, options) {
        const rect = rectangle.element;
        const gridContainer = this.shadowRoot.querySelector(".grid-container");
        const { x, y } = this.calculateRectanglePosition(options, gridContainer);
        rect.style.left = `${x}px`;
        rect.style.top = `${y}px`;
        rect.addEventListener('click', (event) => this.onRectangleClick(event, rectangle, options));
        rect.addEventListener('mousedown', (event) => this.handleRectangleMouseDown(event, rectangle));
        gridContainer.appendChild(rect);
    }
    calculateRectanglePosition(options, container) {
        const containerRect = container.getBoundingClientRect();
        const margin = 10;
        let x = margin;
        let y = margin;
        const rectanglesInSamePosition = this.rectangles.filter(rect => rect.options.rectanglePosition === options.rectanglePosition);
        if (rectanglesInSamePosition.length > 0) {
            const lastRect = rectanglesInSamePosition[rectanglesInSamePosition.length - 1].element.getBoundingClientRect();
            y = lastRect.bottom - containerRect.top + margin;
        }
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
        return { x, y };
    }
    onRectangleClick(event, rectangle, options) {
        event.stopPropagation();
        this.selectRectangle(rectangle);
    }
    selectRectangle(rect) {
        this.rectangles.forEach(rectangle => rectangle.element.classList.remove('selected'));
        rect.element.classList.add('selected');
    }
    removeRectangle(rectangle) {
        if (!rectangle) {
            console.error('Attempted to remove a non-existent rectangle');
            return;
        }
        this.removeConnections(rectangle);
        this.removeRectangleElement(rectangle);
    }
    removeConnections(rectangle) {
        const connectors = Array.from(rectangle.element.querySelectorAll('.connector'));
        connectors.forEach(connector => {
            const connectorId = connector.getAttribute('id');
            if (!connectorId)
                return;
            // Find connections associated with the connector
            this.connectionMap.forEach((connection, id) => {
                if (connection && (connection.from.id === connectorId || connection.to.id === connectorId)) {
                    this.removeLine(id);
                    this.connectionMap.delete(id);
                }
            });
        });
    }
    removeRectangleElement(rectangle) {
        this.rectangles = this.rectangles.filter(r => r !== rectangle);
        rectangle.element.remove();
        this.elementManager.deleteDataObjectById(rectangle.id);
    }
    removeRectangleById(id) {
        const rectangle = this.rectangles.find(r => r && r.options.id === id);
        if (rectangle) {
            this.removeRectangle(rectangle);
        }
        else {
            console.warn(`Rectangle with id ${id} not found`);
        }
    }
    startConnection(event, type) {
        event.preventDefault();
        const connector = event.currentTarget;
        const startType = type;
        // Initialize the state
        let isConnectionInProgress = false;
        const { startX, startY, svg, svgRect } = this.getConnectorPosition(connector);
        let tempLine = null;
        // Debouncing the connection
        const onMouseMove = (moveEvent) => {
            if (!isConnectionInProgress) {
                isConnectionInProgress = true;
                tempLine = this.updateTemporaryLine(tempLine, startX, startY, moveEvent, svgRect);
            }
            else if (tempLine) {
                // Update the temporary line position as we move the mouse
                tempLine.setAttribute("x2", `${moveEvent.clientX - svgRect.left}`);
                tempLine.setAttribute("y2", `${moveEvent.clientY - svgRect.top}`);
            }
        };
        const onMouseUp = (upEvent) => {
            this.handleConnectionEnd(upEvent, startType, connector, tempLine, svgRect, onMouseMove);
            // Ensure the temporary line is removed
            if (tempLine) {
                tempLine.remove();
                tempLine = null;
            }
            // Reset the connection in progress flag
            isConnectionInProgress = false;
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp, { once: true });
    }
    getConnectorPosition(connector) {
        const svg = this.shadowRoot.querySelector("svg");
        const svgRect = svg.getBoundingClientRect();
        const connectorRect = connector.getBoundingClientRect();
        const startX = connectorRect.left + connectorRect.width / 2 - svgRect.left;
        const startY = connectorRect.top + connectorRect.height / 2 - svgRect.top;
        return { startX, startY, svg, svgRect };
    }
    updateTemporaryLine(tempLine, startX, startY, moveEvent, svgRect) {
        if (!tempLine) {
            tempLine = this.drawTemporaryLine(startX, startY);
        }
        tempLine.setAttribute("x2", `${moveEvent.clientX - svgRect.left}`);
        tempLine.setAttribute("y2", `${moveEvent.clientY - svgRect.top}`);
        return tempLine;
    }
    handleConnectionEnd(upEvent, startType, connector, tempLine, svgRect, onMouseMove) {
        const target = this.getConnectorFromEvent(upEvent);
        if (target && target !== connector && this.isValidConnection(startType, target)) {
            this.createConnection(connector, target);
        }
        // Cleanup event listeners and the temporary line
        document.removeEventListener("mousemove", onMouseMove);
        if (tempLine) {
            tempLine.remove();
        }
    }
    createConnection(from, to, inputId) {
        const id = inputId || crypto.randomUUID();
        if (!this.connectionMap.has(id)) {
            this.connectionMap.set(id, undefined);
        }
        else {
            return;
        }
        const connectionObject = {
            id,
            sourceConnectorId: from.getAttribute('id'),
            targetConnectorId: to.getAttribute('id'),
        };
        if (!this.connectionManager.addConnectionObject(connectionObject) && !inputId) {
            console.log('Connection already exists');
            return;
        }
        const fromRectangle = this.rectangles.find(rect => rect.element.contains(from));
        const toRectangle = this.rectangles.find(rect => rect.element.contains(to));
        if (fromRectangle && toRectangle && fromRectangle === toRectangle) {
            console.log("Cannot create a connection between connectors on the same rectangle.");
            return;
        }
        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        const containerRect = this.shadowRoot.querySelector(".grid-container").getBoundingClientRect();
        const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
        const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
        const toX = toRect.left + toRect.width / 2 - containerRect.left;
        const toY = toRect.top + toRect.height / 2 - containerRect.top;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("id", id);
        line.setAttribute("x1", `${fromX}`);
        line.setAttribute("y1", `${fromY}`);
        line.setAttribute("x2", `${toX}`);
        line.setAttribute("y2", `${toY}`);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("shape-rendering", "geometricPrecision");
        line.classList.add("line-hover");
        this.shadowRoot.querySelector("svg").appendChild(line);
        this.connectionMap.set(id, { from, to, line });
    }
    getConnectorFromEvent(upEvent) {
        return upEvent.composedPath().find((el) => el instanceof HTMLElement && el.classList.contains("connector"));
    }
    isValidConnection(startType, target) {
        const targetType = target.classList.contains("input-connector") ? "input" : "output";
        return (startType === "output" && targetType === "input") ||
            (startType === "input" && targetType === "output");
    }
    drawTemporaryLine(startX, startY) {
        const svg = this.shadowRoot.querySelector("svg");
        const tempLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tempLine.setAttribute("x1", `${startX}`);
        tempLine.setAttribute("y1", `${startY}`);
        tempLine.setAttribute("stroke", "black");
        tempLine.setAttribute("id", "temp-line");
        tempLine.setAttribute("shape-rendering", "geometricPrecision");
        svg.appendChild(tempLine);
        return tempLine;
    }
    handleRectangleMouseDown(event, rect) {
        event.stopPropagation();
        const startX = event.clientX;
        const startY = event.clientY;
        const initialPosition = {
            left: parseInt(rect.element.style.left, 10),
            top: parseInt(rect.element.style.top, 10)
        };
        const onMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            let newLeft = initialPosition.left + dx;
            let newTop = initialPosition.top + dy;
            newLeft = Math.max(0, newLeft);
            newTop = Math.max(0, newTop);
            rect.element.style.left = `${newLeft}px`;
            rect.element.style.top = `${newTop}px`;
            this.updateConnections();
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    updateConnections() {
        const containerRect = this.shadowRoot.querySelector(".grid-container").getBoundingClientRect();
        this.connectionMap.forEach((connection) => {
            if (!connection)
                return;
            const fromRect = connection.from.getBoundingClientRect();
            const toRect = connection.to.getBoundingClientRect();
            const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
            const toX = toRect.left + toRect.width / 2 - containerRect.left;
            const toY = toRect.top + toRect.height / 2 - containerRect.top;
            connection.line.setAttribute("x1", `${fromX}`);
            connection.line.setAttribute("y1", `${fromY}`);
            connection.line.setAttribute("x2", `${toX}`);
            connection.line.setAttribute("y2", `${toY}`);
        });
    }
    removeLine(id) {
        const connection = this.connectionMap.get(id);
        if (!connection) {
            console.warn(`No connection found with id: ${id}`);
            return;
        }
        const svg = this.shadowRoot.querySelector("svg");
        if (svg && svg.contains(connection.line)) {
            svg.removeChild(connection.line);
            this.connectionManager.deleteConnectionObjectById(id);
            this.connectionMap.delete(id);
        }
    }
    render() {
        return html `
      <div class="grid-container">
        <svg style="position:absolute; width:100%; height:100%;" id="grid">
          <defs>
            <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="12" refY="6" orient="auto" fill="black">
              <path d="M0,0 L0,12 L12,6 z"/>
            </marker>
          </defs>
        </svg>
      </div>
    `;
    }
};
GraphicalEditor.styles = css `
    :host {
      display: block;
      height: 100%;
    }

    .grid-container {
      position: relative;
      width: 100%;
      height: 100%;
      background-size: 20px 20px;
      background-color: white;
      background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1) 1px,
        transparent 1px
      ), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
      overflow: auto;
    }

    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      shape-rendering: geometricPrecision;
      backface-visibility: hidden;
      transform: translateZ(0);
    }

    .rectangle {
      position: absolute;
      width: 120px;
      height: 100%;
      background-color: #fdf5e3;
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      cursor: move;
      z-index: 2;
      user-select: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-family: Arial, sans-serif;
      color: #333;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      padding-bottom: 0;
    }

    .rectangle:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .rectangle-header {
      background-color: #e0e0e0;
      color: #000;
      padding: 4px 6px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      text-align: left;
      font-weight: bold;
      font-size: 12px;
      border-radius: 6px 6px 0 0;
    }

    .connector {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      cursor: pointer;
      position: absolute;
      background-color: #555;
      border: 2px solid #ccc;
      transition: background-color 0.2s ease, transform 0.2s ease, top 0.3s ease;
    }

    .connector:hover {
      background-color: #999;
      transform: scale(1.2);
    }

    .connector.move-up {
      top: -25px !important;
    }

    .input-connector {
      background-color: #3ba55d;
    }

    .output-connector {
      background-color: #e63946;
    }

    .connector-text {
      font-size: 13px;
      color: #333;
      font-family: Arial, sans-serif;
      position: absolute;
      white-space: nowrap;
    }

    .action-overlay-container {
      display: flex;
      flex-direction: column;
      background-color: #faf4e6;
      border: 1px solid #ccc;
      padding: 5px;
      border-radius: 4px;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1100;
      position: absolute;
    }

    .action-bar {
      display: flex;
      justify-content: flex-start;
      padding: 4px;
      background-color: rgba(0, 0, 0, 0.05);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .rectangle:hover .action-bar {
      opacity: 1;
    }

    .action-bar button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      margin: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-bar button:hover {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
    }

    mwc-icon {
      font-size: 16px;
      color: #333;
    }
  `;
__decorate([
    state()
], GraphicalEditor.prototype, "rectangles", void 0);
__decorate([
    state()
], GraphicalEditor.prototype, "connectionMap", void 0);
GraphicalEditor = __decorate([
    customElement("graphical-editor")
], GraphicalEditor);
export { GraphicalEditor };
//# sourceMappingURL=graphical-editor.js.map