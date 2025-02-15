import { ITerminalKioskConfig } from "@djonnyx/tornado-types";
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

    export const selectServiceUnavailableIntros = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.ads.serviceUnavailableIntros;
    });

    export const selectBanners = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.ads.banners;
    });

    export const selectDefaultCurrency = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.defaultCurrency;
    });

    export const selectLangages = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.languages;
    });

    export const selectOrderTypes = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.orderTypes;
    });

    export const selectTags = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.tags;
    });

    export const selectMenu = createSelector(getCombinedData, (state) => {
        return state?.data?.menu;
    });

    export const selectBusinessPeriods = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.__raw.businessPeriods;
    });

    export const selectTerminals = createSelector(getCombinedData, (state) => {
        return state?.data?.refs.__raw.terminals;
    });

    export const selectTerminal = createSelector(getCombinedData, (state) => {
        return state?.terminal;
    });

    export const selectConfig = createSelector(getCombinedData, (state) => {
        return state?.terminal?.config as ITerminalKioskConfig;
    });
}