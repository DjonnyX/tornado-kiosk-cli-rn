import { ICompiledOrderType, ICompiledLanguage, IKioskTheme } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../../components/navigation";

export interface ICapabilitiesState {
    themes: IKioskTheme | undefined;
    language: ICompiledLanguage | undefined;
    orderType: ICompiledOrderType | undefined;
    currentScreen: MainNavigationScreenTypes | undefined;
}