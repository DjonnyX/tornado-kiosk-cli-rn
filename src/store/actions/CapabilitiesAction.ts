import { Action } from "redux";
import { ICompiledOrderType, ICompiledLanguage } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../../components/navigation";

export enum CapabilitiesActionTypes {
    SET_LANGUAGE = "TORNADO/capabilities/set-language",
    SET_ORDER_TYPE = "TORNADO/capabilities/set-order-type",
    SET_CURRENT_SCREEN = "TORNADO/capabilities/set-current-screen",
}

interface ICapabilitiesActionSetLanguage extends Action<CapabilitiesActionTypes> {
    language: ICompiledLanguage;
}

interface ICapabilitiesActionSetOrderType extends Action<CapabilitiesActionTypes> {
    orderType: ICompiledOrderType;
}

interface ICapabilitiesActionSetCurrentScreen extends Action<CapabilitiesActionTypes> {
    screen: MainNavigationScreenTypes;
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

    static setCurrentScreen = (screen: MainNavigationScreenTypes): ICapabilitiesActionSetCurrentScreen => ({
        type: CapabilitiesActionTypes.SET_ORDER_TYPE,
        screen,
    });
}

export type TCapabilitiesActions = ICapabilitiesActionSetLanguage | ICapabilitiesActionSetOrderType | ICapabilitiesActionSetCurrentScreen;