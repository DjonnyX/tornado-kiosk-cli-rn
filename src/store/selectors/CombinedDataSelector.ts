import { createSelector } from "reselect";
import { IAppState } from "../state";

const getCombinedData = (state: IAppState) => state.combinedData;

export namespace CombinedDataSelectors {
    export const selectProgress = createSelector(getCombinedData, (state) => {
        return Math.ceil(state?.progress.total === 0 ? 0 : ((state?.progress.current || 0) / state?.progress.total) * 100);
    });

    export const selectLoaded = createSelector(getCombinedData, (state) => {
        return !!state?.data;
    });
}