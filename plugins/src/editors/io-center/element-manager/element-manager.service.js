import {BehaviorSubject, Subject} from "../../../../../_snowpack/pkg/rxjs.js";
export class ElementManagerService {
  constructor() {
    this.#dataObjectMap = new Map();
    this.#dataObjects = new BehaviorSubject([]);
    this.dataObjects$ = this.#dataObjects.asObservable();
    this.#dataObjectAdded = new Subject();
    this.dataObjectAdded$ = this.#dataObjectAdded.asObservable();
    this.#dataObjectDeleted = new Subject();
    this.dataObjectDeleted$ = this.#dataObjectDeleted.asObservable();
  }
  #dataObjectMap;
  #dataObjects;
  #dataObjectAdded;
  #dataObjectDeleted;
  static getInstance() {
    if (!ElementManagerService.instance) {
      ElementManagerService.instance = new ElementManagerService();
    }
    return ElementManagerService.instance;
  }
  getDataObjects() {
    return Array.from(this.#dataObjectMap.values());
  }
  addDataObject(dataObject) {
    if (this.#dataObjectMap.has(dataObject.id)) {
      console.warn(`Data Object with id ${dataObject.id} already exists.`);
      return;
    }
    this.#dataObjectMap.set(dataObject.id, dataObject);
    this.#dataObjects.next(this.getDataObjects());
    this.#dataObjectAdded.next(dataObject);
  }
  deleteDataObjectById(id) {
    const deletedDataObject = this.#dataObjectMap.get(id);
    if (!deletedDataObject) {
      return;
    }
    this.#dataObjectMap.delete(id);
    this.#dataObjects.next(this.getDataObjects());
    this.#dataObjectDeleted.next(deletedDataObject);
  }
  getDataObjectByConnectorId(connectorId) {
    for (const dataObject of this.#dataObjectMap.values()) {
      if (dataObject.connectors.find((c) => c.id === connectorId)) {
        return dataObject;
      }
    }
    return void 0;
  }
  getRouters() {
    return Array.from(this.#dataObjectMap.values()).filter((d) => d.type === "ROUTER");
  }
  clearDataObjects() {
    this.#dataObjectMap.clear();
    this.#dataObjects.next([]);
  }
}
