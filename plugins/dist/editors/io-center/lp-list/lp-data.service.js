var _LpDataService_lpData;
import { __classPrivateFieldGet } from "../../../../../_snowpack/pkg/tslib.js";
import { BehaviorSubject } from "../../../../../_snowpack/pkg/rxjs.js";
export class LpDataService {
    constructor() {
        _LpDataService_lpData.set(this, new BehaviorSubject([]));
        this.lpData$ = __classPrivateFieldGet(this, _LpDataService_lpData, "f").asObservable();
    }
    static getInstance() {
        if (!LpDataService.instance) {
            LpDataService.instance = new LpDataService();
        }
        return LpDataService.instance;
    }
    setLpData(lpData) {
        __classPrivateFieldGet(this, _LpDataService_lpData, "f").next(lpData);
    }
    getLpData() {
        return __classPrivateFieldGet(this, _LpDataService_lpData, "f").getValue();
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
_LpDataService_lpData = new WeakMap();
//# sourceMappingURL=lp-data.service.js.map