import { ICompiledOrderType, ICompiledLanguage } from "@djonnyx/tornado-types";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainNavigationScreenTypes } from "../../components/navigation";

export interface ICapabilitiesState {
    language: ICompiledLanguage | undefined;
    orderType: ICompiledOrderType | undefined;
    currentScreen: MainNavigationScreenTypes | undefined;
    navigator: StackNavigationProp<any, MainNavigationScreenTypes> | undefined;
}