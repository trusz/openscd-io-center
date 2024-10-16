import {Connector} from "./connector.interface";

export interface Router {
  name: string;
  type: string;
  inputConnectors: Connector[];
  outputConnectors: Connector[];
}

// Example: <LNRef refLDInst="CircuitBreaker_CB1" refLNClass="XCBR" refLnInst="1" refDo="Pos"/>
export interface LNRef {
  refLDInst: string;
  refLNClass: string;
  refLnInst: string;
  refDo: string;
}

// Example: <DOI name="InOff" desc="">
export interface DataObjectInstance {
  name: string;
  desc: string;
  refs: LNRef[];
}

// Example: <LN lnClass="LRTD" inst="1" lnType="LRTD">
export interface RouterInstance {
  lnClass: string; // Name of the router e.g "LRTD-1"
  lnType: string; // Type of the router e.g "LRTD"
  inst: string; // Instance of the router e.g "1"
  dataObjectsInstances: DataObjectInstance[]; // Data object instances of the router
}
