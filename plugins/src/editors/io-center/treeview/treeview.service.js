import {BehaviorSubject, Subject} from "../../../../../_snowpack/pkg/rxjs.js";
export class TreeviewService {
  constructor() {
    this.#treeDataObjects = new BehaviorSubject([]);
    this.treeDataObjects$ = this.#treeDataObjects.asObservable();
    this.#selectedDataObject = new Subject();
    this.selectedDataObject$ = this.#selectedDataObject.asObservable();
    this.#lastSelectedDataObject = void 0;
  }
  #treeDataObjects;
  #selectedDataObject;
  #lastSelectedDataObject;
  static getInstance() {
    if (!TreeviewService.instance) {
      TreeviewService.instance = new TreeviewService();
    }
    return TreeviewService.instance;
  }
  setSelectedDataObject(dataObject) {
    this.#selectedDataObject.next(dataObject);
    this.#lastSelectedDataObject = dataObject;
  }
  clearTreeDataObjects() {
    this.#selectedDataObject.next(void 0);
    this.#treeDataObjects.next([]);
  }
  parseDataObjectsFromXML(doc, ied, targetCdcs) {
    const targetCdcSet = new Set(targetCdcs);
    const dataObjects = [];
    const iedElement = doc.querySelector(`IED[name="${ied}"]`);
    if (!iedElement) {
      console.error(`IED with name ${ied} not found`);
      return [];
    }
    const lDevices = Array.from(iedElement.querySelectorAll("LDevice"));
    lDevices.forEach((lDevice) => {
      const ldRef = lDevice.getAttribute("inst") || "";
      const lnElements = Array.from(lDevice.querySelectorAll("LN"));
      lnElements.forEach((ln) => {
        const lnClass = ln.getAttribute("lnClass") || "";
        const lnInst = ln.getAttribute("inst") || "";
        const lnType = ln.getAttribute("lnType") || "";
        const lnNodeType = doc.querySelector(`LNodeType[id="${lnType}"]`);
        if (!lnNodeType) {
          return;
        }
        const doElements = Array.from(lnNodeType.querySelectorAll("DO"));
        doElements.forEach((doElement) => {
          const name = doElement.getAttribute("name") || "";
          const cdc = this.getDoType(doElement, doc, targetCdcSet);
          if (!cdc) {
            return;
          }
          const connectorType = lnClass.endsWith("I") ? "output" : "input";
          const connectors = [{
            id: crypto.randomUUID(),
            name,
            type: connectorType
          }];
          const fullPath = `${ldRef}.${lnClass}-${lnInst}.${name}`;
          dataObjects.push({
            id: crypto.randomUUID(),
            name,
            type: "DO",
            lnClass,
            lnInst,
            ldRef,
            path: fullPath,
            connectors
          });
        });
      });
    });
    this.#treeDataObjects.next(dataObjects);
  }
  getDoType(doElement, doc, targetCdcSet) {
    const type = doElement.getAttribute("type") || "";
    if (type === "") {
      return void 0;
    }
    const doType = doc.querySelector(`DOType[id="${type}"]`);
    if (!doType) {
      return void 0;
    }
    const cdc = doType.getAttribute("cdc") || "";
    if (cdc === "" || !targetCdcSet.has(cdc.toLowerCase())) {
      return void 0;
    }
    return cdc;
  }
  get lastSelectedDataObject() {
    return this.#lastSelectedDataObject;
  }
}
