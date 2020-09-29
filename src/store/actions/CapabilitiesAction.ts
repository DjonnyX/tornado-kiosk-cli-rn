import { Action } from "redux";

export enum CapabilitiesActionTypes {
    SET_DEFAULT_LANGUAGE_CODE = "TORNADO/capabilities/set-default-language-code",
}

interface ICapabilitiesActionSetData extends Action<CapabilitiesActionTypes> {
    defaultLanguageCode: string;
}
export class CapabilitiesActions {
    static setDefaultLanguageCode = (defaultLanguageCode: string): ICapabilitiesActionSetData => ({
        type: CapabilitiesActionTypes.SET_DEFAULT_LANGUAGE_CODE,
        defaultLanguageCode,
    });
}

export type TCapabilitiesActions = ICapabilitiesActionSetData;