import { BehaviorSubject, Subject } from 'rxjs';
import { DataObject } from './data-object';

export class ElementManagerService {
  private static instance: ElementManagerService;

  #dataObjectMap: Map<string, DataObject> = new Map();

  #dataObjects: BehaviorSubject<DataObject[]> = new BehaviorSubject<DataObject[]>([]);
  dataObjects$ = this.#dataObjects.asObservable();

  #dataObjectAdded: Subject<DataObject> = new Subject<DataObject>();
  dataObjectAdded$ = this.#dataObjectAdded.asObservable();

  #dataObjectDeleted: Subject<DataObject> = new Subject<DataObject>();
  dataObjectDeleted$ = this.#dataObjectDeleted.asObservable();

  private constructor() {}

  public static getInstance(): ElementManagerService {
    if (!ElementManagerService.instance) {
      ElementManagerService.instance = new ElementManagerService();
    }
    return ElementManagerService.instance;
  }

  getDataObjects(): DataObject[] {
    return Array.from(this.#dataObjectMap.values());
  }

  addDataObject(dataObject: DataObject) {
    if (this.#dataObjectMap.has(dataObject.id)) {
      console.warn(`Data Object with id ${dataObject.id} already exists.`);
      return;
    }

    this.#dataObjectMap.set(dataObject.id, dataObject);
    this.#dataObjects.next(this.getDataObjects());
    this.#dataObjectAdded.next(dataObject);
  }

  deleteDataObjectById(id: string) {
    const deletedDataObject = this.#dataObjectMap.get(id);

    if (!deletedDataObject) {
      return;
    }

    this.#dataObjectMap.delete(id);
    this.#dataObjects.next(this.getDataObjects());

    this.#dataObjectDeleted.next(deletedDataObject);
  }

  getDataObjectByConnectorId(connectorId: string): DataObject | undefined {
    for (const dataObject of this.#dataObjectMap.values()) {
      if (dataObject.connectors.find((c) => c.id === connectorId)) {
        return dataObject;
      }
    }
    return undefined;
  }

  getRouters(): DataObject[] {
    return Array.from(this.#dataObjectMap.values()).filter((d) => d.type === 'ROUTER');
  }

  clearDataObjects() {
    this.#dataObjectMap.clear();
    this.#dataObjects.next([]);
  }
}
