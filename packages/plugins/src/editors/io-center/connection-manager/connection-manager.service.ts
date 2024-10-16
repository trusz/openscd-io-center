import { BehaviorSubject, Subject } from 'rxjs';
import {ConnectionObject} from "./connection-object";

export class ConnectionManagerService {
  private static instance: ConnectionManagerService;

  #connectionObjects: BehaviorSubject<ConnectionObject[]> = new BehaviorSubject<ConnectionObject[]>([]);
  connectionObjects$ = this.#connectionObjects.asObservable();

  #connectionAdded: Subject<ConnectionObject> = new Subject<ConnectionObject>();
  connectionAdded$ = this.#connectionAdded.asObservable();

  #connectionDeleted: Subject<ConnectionObject> = new Subject<ConnectionObject>();
  connectionDeleted$ = this.#connectionDeleted.asObservable();

  private constructor() {}

  public static getInstance(): ConnectionManagerService {
    if (!ConnectionManagerService.instance) {
      ConnectionManagerService.instance = new ConnectionManagerService();
    }
    return ConnectionManagerService.instance;
  }

  get connectionObjects() {
    return this.#connectionObjects.getValue();
  }

  private checkIfConnectionExists(sourceConnectorId: string, targetConnectorId: string) {
    const connectionObjects = this.#connectionObjects.getValue();
    return connectionObjects.find((c) => c.sourceConnectorId === sourceConnectorId && c.targetConnectorId === targetConnectorId) ||
      connectionObjects.find((c) => c.sourceConnectorId === targetConnectorId && c.targetConnectorId === sourceConnectorId);
  }

  setConnectionObjects(connectionObjects: ConnectionObject[]) {
    this.#connectionObjects.next(connectionObjects);
  }

  addConnectionObject(connectionObject: ConnectionObject): boolean {
    if (this.checkIfConnectionExists(connectionObject.sourceConnectorId, connectionObject.targetConnectorId)) {
      return false;
    }

    const connectionObjects = this.#connectionObjects.getValue();
    connectionObjects.push(connectionObject);
    this.#connectionObjects.next(connectionObjects);
    this.#connectionAdded.next(connectionObject);
    return true;
  }

  deleteConnectionObjectById(id: string) {
    const connectionObjects = this.#connectionObjects.getValue();
    const index = connectionObjects.findIndex((d) => d.id === id);
    if (index > -1) {
      const connectionObject = connectionObjects[index];
      connectionObjects.splice(index, 1);
      this.#connectionObjects.next(connectionObjects);
      this.#connectionDeleted.next(connectionObject);
    }
  }

  findConnectionToOrFromConnector(connectorId: string) {
    const connectionObjects = this.#connectionObjects.getValue();
    return connectionObjects.find((c) => c.sourceConnectorId === connectorId || c.targetConnectorId === connectorId);
  }

  clearConnections() {
    this.#connectionObjects.next([]);
  }
}
