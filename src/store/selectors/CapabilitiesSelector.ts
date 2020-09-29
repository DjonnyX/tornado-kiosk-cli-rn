import { createSelector } from "reselect";
import { IAppState } from "../state";

const getCapabilities = (state: IAppState) => state.capabilities;

export namespace CapabilitiesSelectors {
    export const selecLanguage = createSelector(getCapabilities, (state) => {
        return state?.language;
    });
}