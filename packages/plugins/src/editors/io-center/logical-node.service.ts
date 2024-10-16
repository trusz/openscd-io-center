import {BehaviorSubject} from 'rxjs';
import {ILogicalNode} from "./interfaces/logical-node.interface";

class LogicalNodeDataService {
  private _logicalNodes = new BehaviorSubject<ILogicalNode[]>([]);
  logicalNodes$ = this._logicalNodes.asObservable();

  setLogicalNodes(logicalNodes: ILogicalNode[], callerId?: string) {
    this._logicalNodes.next(logicalNodes);
  }

  getLogicalNodes() {
    return this._logicalNodes.getValue();
  }

  addLogicalNode(logicalNode: ILogicalNode, callerId?: string) {
    const currentLogicalNodes = this.getLogicalNodes();
    this.setLogicalNodes([...currentLogicalNodes, logicalNode], callerId);
  }

  clearLogicalNodes(callerId?: string) {
    this.setLogicalNodes([], callerId);
  }

  filterByLnClass(lnClass: string, callerId?: string) {
    const currentLogicalNodes = this.getLogicalNodes();
    return currentLogicalNodes.filter((ln) => ln.lnClass === lnClass)
  }
}

export const logicalNodeDataService = new LogicalNodeDataService();
