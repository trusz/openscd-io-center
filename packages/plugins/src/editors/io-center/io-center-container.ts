import {css, customElement, html, property, PropertyValues, query, state, TemplateResult} from "lit-element";
import {IoCenterFoundation} from "./foundation";
import {getDescriptionAttribute, getNameAttribute,} from '@openscd/open-scd/src/foundation.js';
import {nothing} from "lit-html";


import './treeview/treeview';
import './graphical-editor/graphical-editor';
import './lp-list/lp-list';
import './components/io-center-modal';
import './components/forms/openscd-button';
import './components/router-selection/router-selection';

import {GraphicalEditor} from "./graphical-editor/graphical-editor";
import {RectangleOptions} from "./graphical-editor/rectangle.options";
import {TreeView} from "./treeview/treeview";
import {LpList} from "./lp-list/lp-list";
import {ILogicalNode} from "./interfaces/logical-node.interface";
import {RouterOptions} from "./components/router-selection/router-selection";
import {Subscription} from 'rxjs';
import {ElementManagerService} from "./element-manager/element-manager.service";
import {DataObject, DataObjectConnector} from "./element-manager/data-object";
import {Connector} from "./interfaces/connector.interface";
import {ConnectionManagerService} from "./connection-manager/connection-manager.service";
import {checkIfLNRefExists, getLPsFromIED, getParentLN, writeXMLDictToXML} from "./utils/xml-util";
import {ConnectionObject} from "./connection-manager/connection-object";
import {LpDataService} from "./lp-list/lp-data.service";
import {TreeviewService} from "./treeview/treeview.service";

@customElement('io-center-container')
export class IoCenterContainer extends IoCenterFoundation {
  @property({type: String}) currentIed: string = '';

  @query('graphical-editor') graphicalEditor!: GraphicalEditor;
  @query('tree-view') treeView!: TreeView;
  @query('lp-list') lpList!: LpList;

  @state() private lpModels: ILogicalNode[] = [];
  @state() private currentSelectedRouter: RouterOptions | undefined = undefined;
  @state() private showModal = false;
  @state() private isFormValid = false;

  private subList: Subscription[] = [];

  private elementManager = ElementManagerService.getInstance();
  private connectionManager = ConnectionManagerService.getInstance();
  private lpDataService = LpDataService.getInstance();
  private treeviewService = TreeviewService.getInstance();

  constructor() {
    super();
    this.subList.push(this.elementManager.dataObjectAdded$.subscribe((dataObject) => {
      const connectionObjects: ConnectionObject[] = [];

      const options = this.generateRectangleOptions(dataObject);
      if (!options) {
        console.error("Rectangle options not found for data object:", dataObject);
        return;
      }

      if (dataObject.type === "DO") {
        this.graphicalEditor.clearAllRectangles();
        const lnRefElement = checkIfLNRefExists(this.doc, dataObject.ldRef, dataObject.lnClass, dataObject.lnInst, dataObject.connectors[0].name, this.currentIed);
        if (lnRefElement) {
          const routerElement = getParentLN(lnRefElement);
          if (routerElement) {
            const connections = this.processRouterLN(routerElement, dataObject);
            connectionObjects.push(...connections);
          }
        }
      }

      // Add clicked DO to the graphical editor
      this.graphicalEditor.addRectangle(options);

      // Adding all connection here because objects should be rendered and in the DOM
      if (connectionObjects.length > 0) {
        connectionObjects.forEach(connection => {
          this.connectionManager.addConnectionObject(connection);
        });
      }
    }));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subList.forEach(sub => sub.unsubscribe());
  }

  private generateRectangleOptions(dataObject: DataObject): RectangleOptions | undefined {
    if (dataObject.type === "DO") {
      return this.generateDORectangleOptions(dataObject);
    }

    if (dataObject.type === "LP") {
      return this.generateLPRectangleOptions(dataObject);
    }

    if (dataObject.type === "ROUTER") {
      return this.generateRouterRectangleOptions(dataObject);
    }

    return undefined;
  }

  private generateRouterRectangleOptions(dataObject: DataObject): RectangleOptions {
    const height = dataObject.connectors.length * 40;

    return {
      id: dataObject.id,
      text: dataObject.name + "-" + dataObject.lnInst,
      type: dataObject.type,
      rectanglePosition: "middle",
      width: 200,
      height: height,
      inputConnectors: dataObject.connectors
        .filter(connector => connector.type === "input")
        .map(connector => ({text: connector.name, position: "right", type: "input", id: connector.id})),
      outputConnectors: dataObject.connectors
        .filter(connector => connector.type === "output")
        .map(connector => ({text: connector.name, position: "left", type: "output", id: connector.id})),
      onDelete: () => this.elementManager.deleteDataObjectById(dataObject.id),
      onConnectorEdit: () => console.log("Connector edit not implemented yet")
    }
  }

  private generateLPRectangleOptions(dataObject: DataObject): RectangleOptions {
    return {
      id: dataObject.id,
      text: dataObject.name + "-" + dataObject.lnInst,
      type: dataObject.type,
      rectanglePosition: "right",
      width: 200,
      height: 100,
      outputConnectors: dataObject.connectors.filter(connector => connector.type === "output")
        .map(connector => ({text: connector.name, position: "left", type: "output", id: connector.id})),
      onDelete: () => this.elementManager.deleteDataObjectById(dataObject.id),
      onConnectorEdit: () => console.log("Connector edit not implemented yet")
    }
  }

  private generateDORectangleOptions(dataObject: DataObject) {
    const options: RectangleOptions = {
      id: dataObject.id,
      text: dataObject.path,
      type: dataObject.type,
      rectanglePosition: "left",
      width: 200,
      height: 100,
      inputConnectors: dataObject.connectors.filter(connector => connector.type === "input")
        .map(connector => ({text: connector.name, position: "right", type: "input", id: connector.id})),
      onRouterAdd: () => this.showModal = true
    }
    return options;
  }

  private header(): TemplateResult {
    const name = getNameAttribute(this.element);
    const desc = getDescriptionAttribute(this.element);
    return html`${name}${desc ? html` &mdash; ${desc}` : nothing}`;
  }

  private renderTreeView() {
    return html`
      <tree-view
        style="width: 100%"
      </tree-view>`
  }

  private generateConnector(connector: Connector, type: "input" | "output"): DataObjectConnector {
    return {
      id: crypto.randomUUID(),
      name: connector.text,
      type
    }
  }

  private _handleModalClose(event: CustomEvent) {
    this.showModal = false;

    if (!event.detail) {
      this.currentSelectedRouter = undefined;
      return;
    }

    if (!this.currentSelectedRouter) {
      console.error("Current selected router not found");
      return;
    }

    const routerName = this.currentSelectedRouter?.value.toUpperCase()
    if (!routerName) {
      console.error("Router name not found");
      return;
    }

    const inputConnectors = this.currentSelectedRouter?.inputConnectors.map(connector => this.generateConnector(connector, "input"));
    const outputConnectors = this.currentSelectedRouter?.outputConnectors.map(connector => this.generateConnector(connector, "output"));

    const dataObject: DataObject = {
      id: crypto.randomUUID(),
      name: routerName,
      type: "ROUTER",
      lnInst: this.currentSelectedRouter.inst.toString(),
      ldRef: "LD0",
      lnClass: routerName,
      connectors: [...inputConnectors, ...outputConnectors]
    }

    this.elementManager.addDataObject(dataObject);
  }

  private _handleFormValidityChanged(event: CustomEvent) {
    this.isFormValid = event.detail.isValid;
  }

  /*
  Function for updating the LP models
   */
  updateLpModels() {
    this.lpDataService.clearLpData();
    const lpNodes = getLPsFromIED(this.doc, this.currentIed);
    const lpDataObjects: DataObject[] = []
    lpNodes.forEach((node: Element) => {
      const name = node.getAttribute('lnClass');
      if (!name) {
        console.error("LN Class not found in node:", node);
        return;
      }

      const inst = node.getAttribute('inst');
      if (!inst) {
        console.error("LN Instance not found in node:", node);
        return;
      }

      const type = node.getAttribute('lnType');
      if (!type) {
        console.error("LN Type not found in node:", node);
        return;
      }

      const connectorType = name.endsWith("I") ? "output" : "input";
      const connectors: DataObjectConnector[] = [{
        id: crypto.randomUUID(),
        name: 'Ind',
        type: connectorType
      }];

      lpDataObjects.push({
        id: crypto.randomUUID(),
        name: name,
        type: 'LP',
        lnClass: type,
        ldRef: 'LD0',
        lnInst: inst,
        connectors: connectors
      });
    });

    this.lpDataService.setLpData(lpDataObjects);
  }

  /*
  Function for updating the tree data objects
   */
  updateTreeDataObjects() {
    this.treeviewService.clearTreeDataObjects();
    this.elementManager.clearDataObjects();
    this.graphicalEditor.clearAllRectangles();
    this.treeviewService.parseDataObjectsFromXML(this.doc, this.currentIed, ['sps', 'dps', 'dpc', 'inc', 'ins', 'pos']);
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.updateLpModels();
    this.updateTreeDataObjects();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('currentIed')) {
      this.updateLpModels();
      this.updateTreeDataObjects();
    }

    if (changedProperties.has('doc')) {
      this.updateLpModels();
      this.updateTreeDataObjects();
    }
  }

  saveEditor() {
    const routers = this.elementManager.getRouters();
    const xmlDict: any = {};

    routers.forEach(router => {
      xmlDict[router.id] = {
        name: router.name,
        inst: router.lnInst,
        type: router.lnClass,
        dois: {}
      }

      router.connectors.forEach(connector => {
        const connectorObj = this.connectionManager.findConnectionToOrFromConnector(connector.id);
        if (!connectorObj) {
          console.log("Connector not found:", connector.id);
          xmlDict[router.id].dois[connector.id] = {
            name: connector.name,
            desc: connector.type,
            lnRef: {}
          }
          return;
        }

        // Check for correct id, source and target can be interchanged
        const targetConnectorId = connectorObj.sourceConnectorId === connector.id ? connectorObj.targetConnectorId : connectorObj.sourceConnectorId;

        const targetDataObject = this.elementManager.getDataObjectByConnectorId(targetConnectorId);
        if (!targetDataObject) {
          console.log("Target Data Object not found:", targetConnectorId);
          return;
        }

        const targetConnector = targetDataObject.connectors.find(connector => connector.id === targetConnectorId);

        if (!targetConnector) {
          console.log("Target Connector not found:", targetConnectorId);
          return;
        }

        xmlDict[router.id].dois[connector.id] = {
          name: connector.name,
          desc: connector.type,
          lnRef: {
            refLDInst: targetDataObject.ldRef,
            refLNClass: targetDataObject.lnClass,
            refLNInst: targetDataObject.lnInst,
            refDO: targetConnector.name
          }
        }
      });
    });

    writeXMLDictToXML(xmlDict, this.currentIed, this.doc);
  }

  /*
  Function for processing data when loading XML
   */
  processRouterLN(routerLN: Element, lnRefDataObject: DataObject): ConnectionObject[] {
    if (!routerLN) {
      console.error("Provided router LN element is null or undefined.");
      return [];
    }

    const name = routerLN.getAttribute('lnClass');
    const inst = routerLN.getAttribute('inst');
    const type = routerLN.getAttribute('lnType');

    const connectionList: ConnectionObject[] = [];

    const routerDataObject: DataObject = {
      id: crypto.randomUUID(),
      name: name!,
      type: 'ROUTER',
      lnInst: inst!,
      ldRef: 'LD0',
      lnClass: type!,
      connectors: []
    }

    // Iterate over each DOI element within the router LN
    const doiElements = routerLN.querySelectorAll('DOI');
    doiElements.forEach(doi => {
      const doiName = doi.getAttribute('name');
      const doiDesc = doi.getAttribute('desc');

      if (!doiDesc) {
        console.error("DOI description not found. Its needed to define if a DOI is input or output!");
        return;
      }

      const doiConnector: DataObjectConnector = {
        id: crypto.randomUUID(),
        name: doiName || '',
        type: doiDesc as "input" | "output"
      }

      routerDataObject.connectors.push(doiConnector);

      // Iterate over each LNRef element within the DOI
      const lnRefElements = doi.querySelectorAll('LNRef');
      lnRefElements.forEach(lnRef => {
        const refLDInst = lnRef.getAttribute('refLDInst');
        const refLNClass = lnRef.getAttribute('refLNClass');
        const refLNInst = lnRef.getAttribute('refLNInst');
        const refDO = lnRef.getAttribute('refDO');

        if (refLDInst === lnRefDataObject.ldRef &&
          refLNClass === lnRefDataObject.lnClass &&
          refLNInst === lnRefDataObject.lnInst && refDO === lnRefDataObject.connectors[0].name) {
          connectionList.push({
            id: crypto.randomUUID(),
            sourceConnectorId: doiConnector.id,
            targetConnectorId: lnRefDataObject.connectors[0].id
          })

          // Return because we don't want to add the lnRefDataObject to the element manager here
          return;
        }

        const dataObject = this.lpDataService.getLPDataId(refLNClass!, refLNInst!);
        if (!dataObject) {
          console.error("Data Object not found for LNRef:", lnRef);
          return;
        }

        // Add LPs to the element manager
        this.elementManager.addDataObject(dataObject);

        // Create connection object
        connectionList.push({
          id: crypto.randomUUID(),
          sourceConnectorId: doiConnector.id,
          targetConnectorId: dataObject.connectors[0].id
        })
      });
    });

    this.elementManager.addDataObject(routerDataObject);
    return connectionList;
  }

  render(): TemplateResult {
    return html`
      <io-center-modal
        .open="${this.showModal}"
        title="Select Router"
        modalHeight="400px"
        @close="${this._handleModalClose}"
        .disabled="${!this.isFormValid}"
        confirmText="Select">
        <form-group @form-validity-changed="${this._handleFormValidityChanged}">
          <router-selection
            @router-changed="${(e: CustomEvent) => this.currentSelectedRouter = e.detail}"></router-selection>
        </form-group>
      </io-center-modal>

      <div class="io-center-container">
        <div class="io-center-header">
          <div class="left">
            <span>${this.header()}</span>
          </div>

          <div class="middle">
            <openscd-button
              icon="save"
              label="Save"
              @button-click="${() => this.saveEditor()}">
            </openscd-button>
            <lp-editor
              .doc="${this.doc}">
            </lp-editor>
          </div>

          <div class="right"></div>
        </div>

        <div class="io-center-content">
          <div class="treeview">
            ${this.renderTreeView()}
          </div>

          <div class="graphical-editor">
            <graphical-editor></graphical-editor>
          </div>

          <div class="lp-selector">
            <lp-list
              .data="${this.lpModels}"
              .doc="${this.doc}"
            </lp-list>
          </div>
        </div>
      </div>`
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .io-center-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      background-color: #fdf5e3;
      border: 1px solid #cccccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    .io-center-header {
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background-color: #fdf5e3;
      font-size: 20px;
      padding: 0.5rem;
      font-weight: bold;
    }

    .io-center-header .middle {
      display: flex;
      align-items: center;
      flex-direction: row;
    }

    .io-center-content {
      height: 100%;
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: 1fr;
      gap: 0 0;
      grid-auto-flow: row;
      grid-template-areas:
    "treeview graphical-editor lp-selector";
    }

    .treeview {
      grid-area: treeview;
      width: 300px;
      background-color: #fdf5e3;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 0.5rem;
    }

    .graphical-editor {
      grid-area: graphical-editor;
      background-color: #eee8d5;
      height: 100%;
    }

    .lp-selector {
      grid-area: lp-selector;
      width: 300px;
      background-color: #fdf5e3;
      height: auto;
    }
  `
}
