import {ILogicalDevice} from "./logical-device.interface";

export interface IIED {
  name: string;
  logicalDevices: ILogicalDevice[];
  xmlData: Element;
}
