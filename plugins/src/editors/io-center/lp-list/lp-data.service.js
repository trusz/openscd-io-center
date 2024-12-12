import {BehaviorSubject} from "../../../../../_snowpack/pkg/rxjs.js";
export class LpDataService {
  constructor() {
    this.#lpData = new BehaviorSubject([]);
    this.lpData$ = this.#lpData.asObservable();
  }
  #lpData;
  static getInstance() {
    if (!LpDataService.instance) {
      LpDataService.instance = new LpDataService();
    }
    return LpDataService.instance;
  }
  setLpData(lpData) {
    this.#lpData.next(lpData);
  }
  getLpData() {
    return this.#lpData.getValue();
  }
  addLpData(dataObject) {
    const currentLpData = this.getLpData();
    this.setLpData([...currentLpData, dataObject]);
  }
  clearLpData() {
    this.setLpData([]);
  }
  getLPDataId(refLNClass, refLNInst) {
    const currentLpData = this.getLpData();
    return currentLpData.find((d) => d.lnClass === refLNClass && d.lnInst === refLNInst);
  }
}
