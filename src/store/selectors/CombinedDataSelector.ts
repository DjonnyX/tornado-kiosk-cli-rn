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

    export const selectDefaultLanguageCode = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.defaultLanguage?.code;
    });

    export const selectIntros = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.ads.intros;
    });

    export const selectBanners = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.ads.banners;
    });

    export const selectCurrency = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.__raw.currencies[0];
    });

    export const selectMenu = createSelector(getCombinedData, (state) => {
        return state?.data?.menu;
    });
}