import { Action } from "redux";
import { ICompiledOrderType, ICompiledLanguage } from "@djonnyx/tornado-types";

export enum CapabilitiesActionTypes {
    SET_LANGUAGE = "TORNADO/capabilities/set-language",
    SET_ORDER_TYPE = "TORNADO/capabilities/set-order-type",
}

interface ICapabilitiesActionSetLanguage extends Action<CapabilitiesActionTypes> {
    language: ICompiledLanguage;
}

interface ICapabilitiesActionSetOrderType extends Action<CapabilitiesActionTypes> {
    orderType: ICompiledOrderType;
}

export class CapabilitiesActions {
    static setLanguage = (language: ICompiledLanguage): ICapabilitiesActionSetLanguage => ({
        type: CapabilitiesActionTypes.SET_LANGUAGE,
        language,
    });

    static setOrderType = (orderType: ICompiledOrderType): ICapabilitiesActionSetOrderType => ({
        type: CapabilitiesActionTypes.SET_ORDER_TYPE,
        orderType,
    });
}

export type TCapabilitiesActions = ICapabilitiesActionSetLanguage | ICapabilitiesActionSetOrderType;