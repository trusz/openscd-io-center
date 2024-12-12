import { BehaviorSubject } from '../../../../_snowpack/pkg/rxjs.js';
class LogicalNodeDataService {
    constructor() {
        this._logicalNodes = new BehaviorSubject([]);
        this.logicalNodes$ = this._logicalNodes.asObservable();
    }
    setLogicalNodes(logicalNodes, callerId) {
        this._logicalNodes.next(logicalNodes);
    }
    getLogicalNodes() {
        return this._logicalNodes.getValue();
    }
    addLogicalNode(logicalNode, callerId) {
        const currentLogicalNodes = this.getLogicalNodes();
        this.setLogicalNodes([...currentLogicalNodes, logicalNode], callerId);
    }
    clearLogicalNodes(callerId) {
        this.setLogicalNodes([], callerId);
    }
    filterByLnClass(lnClass, callerId) {
        const currentLogicalNodes = this.getLogicalNodes();
        return currentLogicalNodes.filter((ln) => ln.lnClass === lnClass);
    }
}
export const logicalNodeDataService = new LogicalNodeDataService();
//# sourceMappingURL=logical-node.service.js.map