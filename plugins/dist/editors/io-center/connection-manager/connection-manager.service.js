var _ConnectionManagerService_connectionObjects, _ConnectionManagerService_connectionAdded, _ConnectionManagerService_connectionDeleted;
import { __classPrivateFieldGet } from "../../../../../_snowpack/pkg/tslib.js";
import { BehaviorSubject, Subject } from '../../../../../_snowpack/pkg/rxjs.js';
export class ConnectionManagerService {
    constructor() {
        _ConnectionManagerService_connectionObjects.set(this, new BehaviorSubject([]));
        this.connectionObjects$ = __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").asObservable();
        _ConnectionManagerService_connectionAdded.set(this, new Subject());
        this.connectionAdded$ = __classPrivateFieldGet(this, _ConnectionManagerService_connectionAdded, "f").asObservable();
        _ConnectionManagerService_connectionDeleted.set(this, new Subject());
        this.connectionDeleted$ = __classPrivateFieldGet(this, _ConnectionManagerService_connectionDeleted, "f").asObservable();
    }
    static getInstance() {
        if (!ConnectionManagerService.instance) {
            ConnectionManagerService.instance = new ConnectionManagerService();
        }
        return ConnectionManagerService.instance;
    }
    get connectionObjects() {
        return __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").getValue();
    }
    checkIfConnectionExists(sourceConnectorId, targetConnectorId) {
        const connectionObjects = __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").getValue();
        return connectionObjects.find((c) => c.sourceConnectorId === sourceConnectorId && c.targetConnectorId === targetConnectorId) ||
            connectionObjects.find((c) => c.sourceConnectorId === targetConnectorId && c.targetConnectorId === sourceConnectorId);
    }
    setConnectionObjects(connectionObjects) {
        __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").next(connectionObjects);
    }
    addConnectionObject(connectionObject) {
        if (this.checkIfConnectionExists(connectionObject.sourceConnectorId, connectionObject.targetConnectorId)) {
            return false;
        }
        const connectionObjects = __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").getValue();
        connectionObjects.push(connectionObject);
        __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").next(connectionObjects);
        __classPrivateFieldGet(this, _ConnectionManagerService_connectionAdded, "f").next(connectionObject);
        return true;
    }
    deleteConnectionObjectById(id) {
        const connectionObjects = __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").getValue();
        const index = connectionObjects.findIndex((d) => d.id === id);
        if (index > -1) {
            const connectionObject = connectionObjects[index];
            connectionObjects.splice(index, 1);
            __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").next(connectionObjects);
            __classPrivateFieldGet(this, _ConnectionManagerService_connectionDeleted, "f").next(connectionObject);
        }
    }
    findConnectionToOrFromConnector(connectorId) {
        const connectionObjects = __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").getValue();
        return connectionObjects.find((c) => c.sourceConnectorId === connectorId || c.targetConnectorId === connectorId);
    }
    clearConnections() {
        __classPrivateFieldGet(this, _ConnectionManagerService_connectionObjects, "f").next([]);
    }
}
_ConnectionManagerService_connectionObjects = new WeakMap(), _ConnectionManagerService_connectionAdded = new WeakMap(), _ConnectionManagerService_connectionDeleted = new WeakMap();
//# sourceMappingURL=connection-manager.service.js.map