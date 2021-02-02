import { createSelector } from "reselect";
import { IAppState } from "../state";

const getSystem = (state: IAppState) => state.system;

export namespace SystemSelectors {
    export const selectSerialNumber = createSelector(getSystem, (state) => {
        return state.serialNumber;
    });
    
    export const selectTerminalName = createSelector(getSystem, (state) => {
        return state.terminalName;
    });
}