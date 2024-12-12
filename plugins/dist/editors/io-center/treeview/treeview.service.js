var _TreeviewService_treeDataObjects, _TreeviewService_selectedDataObject, _TreeviewService_lastSelectedDataObject;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "../../../../../_snowpack/pkg/tslib.js";
import { BehaviorSubject, Subject } from '../../../../../_snowpack/pkg/rxjs.js';
export class TreeviewService {
    constructor() {
        // These are all data objects that are displayed in the tree view but not selected
        _TreeviewService_treeDataObjects.set(this, new BehaviorSubject([]));
        this.treeDataObjects$ = __classPrivateFieldGet(this, _TreeviewService_treeDataObjects, "f").asObservable();
        // This is the current selected data object in the tree view
        _TreeviewService_selectedDataObject.set(this, new Subject());
        this.selectedDataObject$ = __classPrivateFieldGet(this, _TreeviewService_selectedDataObject, "f").asObservable();
        _TreeviewService_lastSelectedDataObject.set(this, undefined);
    }
    static getInstance() {
        if (!TreeviewService.instance) {
            TreeviewService.instance = new TreeviewService();
        }
        return TreeviewService.instance;
    }
    setSelectedDataObject(dataObject) {
        __classPrivateFieldGet(this, _TreeviewService_selectedDataObject, "f").next(dataObject);
        __classPrivateFieldSet(this, _TreeviewService_lastSelectedDataObject, dataObject, "f");
    }
    clearTreeDataObjects() {
        __classPrivateFieldGet(this, _TreeviewService_selectedDataObject, "f").next(undefined);
        __classPrivateFieldGet(this, _TreeviewService_treeDataObjects, "f").next([]);
    }
    /*
    This function parses the data objects from the XML document and filters them based on the target CDCs.
     */
    parseDataObjectsFromXML(doc, ied, targetCdcs) {
        const targetCdcSet = new Set(targetCdcs);
        const dataObjects = [];
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
                    const connectorType = lnClass.endsWith("I") ? "output" : "input";
                    const connectors = [{
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
        __classPrivateFieldGet(this, _TreeviewService_treeDataObjects, "f").next(dataObjects);
    }
    /*
    This function returns the CDC type of a DO element if it is in the target CDC set. Otherwise, it returns undefined.
     */
    getDoType(doElement, doc, targetCdcSet) {
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
    get lastSelectedDataObject() {
        return __classPrivateFieldGet(this, _TreeviewService_lastSelectedDataObject, "f");
    }
}
_TreeviewService_treeDataObjects = new WeakMap(), _TreeviewService_selectedDataObject = new WeakMap(), _TreeviewService_lastSelectedDataObject = new WeakMap();
//# sourceMappingURL=treeview.service.js.map