import {DataObject} from "../element-manager/data-object";
import {BehaviorSubject} from "rxjs";

export class LpDataService {
  private static instance: LpDataService;

  #lpData: BehaviorSubject<DataObject[]> = new BehaviorSubject<DataObject[]>([]);
  lpData$ = this.#lpData.asObservable();

  private constructor() {}

  static getInstance(): LpDataService {
    if (!LpDataService.instance) {
      LpDataService.instance = new LpDataService();
    }
    return LpDataService.instance;
  }

  setLpData(lpData: DataObject[]) {
    this.#lpData.next(lpData);
  }

  getLpData() {
    return this.#lpData.getValue();
  }

  addLpData(dataObject: DataObject) {
    const currentLpData = this.getLpData();
    this.setLpData([...currentLpData, dataObject]);
  }

  clearLpData() {
    this.setLpData([]);
  }

  getLPDataId(refLNClass: string, refLNInst: string ) {
    const currentLpData = this.getLpData();
    return currentLpData.find((d) => d.lnClass === refLNClass && d.lnInst === refLNInst);
  }
}
