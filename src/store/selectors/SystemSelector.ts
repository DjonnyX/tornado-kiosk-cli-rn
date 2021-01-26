import { createSelector } from "reselect";
import { IAppState } from "../state";

const getSystem = (state: IAppState) => state.system;

export namespace SystemSelectors {
    export const selectDeviceInfo = createSelector(getSystem, (state) => {
        return state.deviceInfo;
    });
    
    export const selectSerialNumber = createSelector(getSystem, (state) => {
        return state.deviceInfo?.serialNumber;
    });
}