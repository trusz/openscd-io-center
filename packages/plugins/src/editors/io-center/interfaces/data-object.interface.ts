import {IDataAttributes} from "./data-attributes.interface";

export interface IDataObject  {
  name: string;
  dataAttributes: IDataAttributes[];
  cdc?: string;
  xmlData: Element;
}
