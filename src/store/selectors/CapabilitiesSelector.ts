import { createSelector } from "reselect";
import { IAppState } from "../state";

const getCapabilities = (state: IAppState) => state.capabilities;

export namespace CapabilitiesSelectors {
    export const selectLanguage = createSelector(getCapabilities, (state) => {
        return state?.language;
    });

    export const selectCurrentScreen = createSelector(getCapabilities, (state) => {
        return state?.currentScreen;
    });

    export const selectNavigator = createSelector(getCapabilities, (state) => {
        return state?.navigator;
    });
}