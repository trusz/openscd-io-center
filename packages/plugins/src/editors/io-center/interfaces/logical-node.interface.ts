import {IDataObject} from "./data-object.interface";

export interface ILogicalNode {
  name: string;
  ldType: string;
  lnClass: string;
  inst: string;
  dataObjects: IDataObject[];
  xmlData: Element | string | undefined;
}
