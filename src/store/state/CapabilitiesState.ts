import { ICompiledOrderType, ICompiledLanguage } from "@djonnyx/tornado-types";

export interface ICapabilitiesState {
    language: ICompiledLanguage | undefined;
    orderType: ICompiledOrderType | undefined;
}