var _ElementManagerService_dataObjectMap, _ElementManagerService_dataObjects, _ElementManagerService_dataObjectAdded, _ElementManagerService_dataObjectDeleted;
import { __classPrivateFieldGet } from "../../../../../_snowpack/pkg/tslib.js";
import { BehaviorSubject, Subject } from '../../../../../_snowpack/pkg/rxjs.js';
export class ElementManagerService {
    constructor() {
        _ElementManagerService_dataObjectMap.set(this, new Map());
        _ElementManagerService_dataObjects.set(this, new BehaviorSubject([]));
        this.dataObjects$ = __classPrivateFieldGet(this, _ElementManagerService_dataObjects, "f").asObservable();
        _ElementManagerService_dataObjectAdded.set(this, new Subject());
        this.dataObjectAdded$ = __classPrivateFieldGet(this, _ElementManagerService_dataObjectAdded, "f").asObservable();
        _ElementManagerService_dataObjectDeleted.set(this, new Subject());
        this.dataObjectDeleted$ = __classPrivateFieldGet(this, _ElementManagerService_dataObjectDeleted, "f").asObservable();
    }
    static getInstance() {
        if (!ElementManagerService.instance) {
            ElementManagerService.instance = new ElementManagerService();
        }
        return ElementManagerService.instance;
    }
    getDataObjects() {
        return Array.from(__classPrivateFieldGet(this, _ElementManagerService_dataObjectMap, "f").values());
    }
    addDataObject(dataObject) {
        if (__classPrivateFieldGet(this, _ElementManagerService_dataObjectMap, "f").has(dataObject.id)) {
            console.warn(`Data Object with id ${dataObject.id} already exists.`);
            return;
        }
        __classPrivateFieldGet(this, _ElementManagerService_dataObjectMap, "f").set(dataObject.id, dataObject);
        __classPrivateFieldGet(this, _ElementManagerService_dataObjects, "f").next(this.getDataObjects());
        __classPrivateFieldGet(this, _ElementManagerService_dataObjectAdded, "f").next(dataObject);
    }
    deleteDataObjectById(id) {
        const deletedDataObject = __classPrivateFieldGet(this, _ElementManagerService_dataObjectMap, "f").get(id);
        if (!deletedDataObject) {
            return;
        }
        __classPrivateFieldGet(this, _ElementManagerService_dataObjectMap, "f").delete(id);
        __classPrivateFieldGet(this, _ElementManagerService_dataObjects, "f").next(this.getDataObjects());
        __classPrivateFieldGet(this, _ElementManagerService_dataObjectDeleted, "f").next(deletedDataObject);
    }
    getDataObjectByConnectorId(connectorId) {
        for (const dataObject of __classPrivateFieldGet(this, _ElementManagerService_dataObjectMap, "f").values()) {
            if (dataObject.connectors.find((c) => c.id === connectorId)) {
                return dataObject;
            }
        }
        return undefined;
    }
    getRouters() {
        return Array.from(__classPrivateFieldGet(this, _ElementManagerService_dataObjectMap, "f").values()).filter((d) => d.type === 'ROUTER');
    }
    clearDataObjects() {
        __classPrivateFieldGet(this, _ElementManagerService_dataObjectMap, "f").clear();
        __classPrivateFieldGet(this, _ElementManagerService_dataObjects, "f").next([]);
    }
}
_ElementManagerService_dataObjectMap = new WeakMap(), _ElementManagerService_dataObjects = new WeakMap(), _ElementManagerService_dataObjectAdded = new WeakMap(), _ElementManagerService_dataObjectDeleted = new WeakMap();
//# sourceMappingURL=element-manager.service.js.map