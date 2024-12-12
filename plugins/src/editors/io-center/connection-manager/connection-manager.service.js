import {BehaviorSubject, Subject} from "../../../../../_snowpack/pkg/rxjs.js";
export class ConnectionManagerService {
  constructor() {
    this.#connectionObjects = new BehaviorSubject([]);
    this.connectionObjects$ = this.#connectionObjects.asObservable();
    this.#connectionAdded = new Subject();
    this.connectionAdded$ = this.#connectionAdded.asObservable();
    this.#connectionDeleted = new Subject();
    this.connectionDeleted$ = this.#connectionDeleted.asObservable();
  }
  #connectionObjects;
  #connectionAdded;
  #connectionDeleted;
  static getInstance() {
    if (!ConnectionManagerService.instance) {
      ConnectionManagerService.instance = new ConnectionManagerService();
    }
    return ConnectionManagerService.instance;
  }
  get connectionObjects() {
    return this.#connectionObjects.getValue();
  }
  checkIfConnectionExists(sourceConnectorId, targetConnectorId) {
    const connectionObjects = this.#connectionObjects.getValue();
    return connectionObjects.find((c) => c.sourceConnectorId === sourceConnectorId && c.targetConnectorId === targetConnectorId) || connectionObjects.find((c) => c.sourceConnectorId === targetConnectorId && c.targetConnectorId === sourceConnectorId);
  }
  setConnectionObjects(connectionObjects) {
    this.#connectionObjects.next(connectionObjects);
  }
  addConnectionObject(connectionObject) {
    if (this.checkIfConnectionExists(connectionObject.sourceConnectorId, connectionObject.targetConnectorId)) {
      return false;
    }
    const connectionObjects = this.#connectionObjects.getValue();
    connectionObjects.push(connectionObject);
    this.#connectionObjects.next(connectionObjects);
    this.#connectionAdded.next(connectionObject);
    return true;
  }
  deleteConnectionObjectById(id) {
    const connectionObjects = this.#connectionObjects.getValue();
    const index = connectionObjects.findIndex((d) => d.id === id);
    if (index > -1) {
      const connectionObject = connectionObjects[index];
      connectionObjects.splice(index, 1);
      this.#connectionObjects.next(connectionObjects);
      this.#connectionDeleted.next(connectionObject);
    }
  }
  findConnectionToOrFromConnector(connectorId) {
    const connectionObjects = this.#connectionObjects.getValue();
    return connectionObjects.find((c) => c.sourceConnectorId === connectorId || c.targetConnectorId === connectorId);
  }
  clearConnections() {
    this.#connectionObjects.next([]);
  }
}
