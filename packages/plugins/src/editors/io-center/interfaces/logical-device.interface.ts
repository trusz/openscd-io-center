import {ILogicalNode} from "./logical-node.interface";

export interface ILogicalDevice {
  name: string;
  logicalNodes: ILogicalNode[];
  xmlData: Element;
}
