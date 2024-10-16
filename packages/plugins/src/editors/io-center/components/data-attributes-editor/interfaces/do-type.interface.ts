import {IDataAttribute} from "./data-attribute.interface";

export interface IDoType {
  cdc: string;
  id: string;
  dataAttributes: IDataAttribute[];
}
