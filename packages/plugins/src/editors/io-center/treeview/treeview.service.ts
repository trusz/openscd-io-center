import { BehaviorSubject, Subject } from 'rxjs';
import {DataObject, DataObjectConnector} from "../element-manager/data-object";

export class TreeviewService {
  private static instance: TreeviewService;

  // These are all data objects that are displayed in the tree view but not selected
  #treeDataObjects: BehaviorSubject<DataObject[]> = new BehaviorSubject<DataObject[]>([]);
  treeDataObjects$ = this.#treeDataObjects.asObservable();

  // This is the current selected data object in the tree view
  #selectedDataObject: Subject<DataObject> = new Subject<DataObject>();
  selectedDataObject$ = this.#selectedDataObject.asObservable();
  #lastSelectedDataObject: DataObject | undefined = undefined;

  private constructor() {}

  public static getInstance(): TreeviewService {
    if (!TreeviewService.instance) {
      TreeviewService.instance = new TreeviewService();
    }
    return TreeviewService.instance;
  }

  setSelectedDataObject(dataObject: DataObject) {
    this.#selectedDataObject.next(dataObject);
    this.#lastSelectedDataObject = dataObject;
  }

  clearTreeDataObjects() {
    this.#selectedDataObject.next(undefined);
    this.#treeDataObjects.next([]);
  }

  /*
  This function parses the data objects from the XML document and filters them based on the target CDCs.
   */
  parseDataObjectsFromXML(doc: XMLDocument, ied: string, targetCdcs: string[]) {
    const targetCdcSet = new Set(targetCdcs);
    const dataObjects: DataObject[] = [];

    // Find the IED element
    const iedElement = doc.querySelector(`IED[name="${ied}"]`);
    if (!iedElement) {
      console.error(`IED with name ${ied} not found`);
      return [];
    }

    // Parse all LDevices
    const lDevices = Array.from(iedElement.querySelectorAll("LDevice"));
    lDevices.forEach(lDevice => {
      const ldRef = lDevice.getAttribute("inst") || "";

      // Parse all LN elements within each LDevice
      const lnElements = Array.from(lDevice.querySelectorAll("LN"));
      lnElements.forEach(ln => {
        const lnClass = ln.getAttribute("lnClass") || "";
        const lnInst = ln.getAttribute("inst") || "";
        const lnType = ln.getAttribute("lnType") || "";

        // Get the DO elements for this LN
        const lnNodeType = doc.querySelector(`LNodeType[id="${lnType}"]`);
        if (!lnNodeType) {
          return;
        }

        const doElements = Array.from(lnNodeType.querySelectorAll("DO"));
        doElements.forEach(doElement => {
          const name = doElement.getAttribute("name") || "";
          const cdc = this.getDoType(doElement, doc, targetCdcSet);
          if (!cdc) {
            return;
          }

          const connectorType: "input" | "output" = lnClass.endsWith("I") ? "output" : "input";
          const connectors: DataObjectConnector[] = [{
            id: crypto.randomUUID(),
            name: name,
            type: connectorType
          }];

          const fullPath = `${ldRef}.${lnClass}-${lnInst}.${name}`;

          dataObjects.push({
            id: crypto.randomUUID(),
            name: name,
            type: "DO",
            lnClass: lnClass,
            lnInst: lnInst,
            ldRef: ldRef,
            path: fullPath,
            connectors: connectors
          });
        });
      });
    });

    this.#treeDataObjects.next(dataObjects);
  }

  /*
  This function returns the CDC type of a DO element if it is in the target CDC set. Otherwise, it returns undefined.
   */
  private getDoType(doElement: Element, doc: XMLDocument, targetCdcSet: Set<string>): string | undefined {
    const type = doElement.getAttribute("type") || "";
    if (type === "") {
      return undefined;
    }

    const doType = doc.querySelector(`DOType[id="${type}"]`);
    if (!doType) {
      return undefined;
    }

    const cdc = doType.getAttribute("cdc") || "";
    if (cdc === "" || !targetCdcSet.has(cdc.toLowerCase())) {
      return undefined;
    }

    return cdc;
  }

  get lastSelectedDataObject(): DataObject | undefined {
    return this.#lastSelectedDataObject;
  }
}
