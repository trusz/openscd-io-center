import {DataObject} from "../element-manager/data-object";

export interface ITreeNode {
  name: string;
  children: ITreeNode[];
  expanded: boolean;
  dataObject?: DataObject;
}
