export interface DataObjectConnector {
  id: string;
  name: string;
  type: "input" | "output";
}


export interface DataObject {
  id: string;
  name: string;
  type: string;
  lnClass: string;
  lnInst: string;
  ldRef: string;
  path?: string;
  desc?: string;
  connectors: DataObjectConnector[];
}
