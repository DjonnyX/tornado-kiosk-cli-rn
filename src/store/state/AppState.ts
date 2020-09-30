import { ICombinedDataState } from "./CombinedDataState";
import { ICapabilitiesState } from "./CapabilitiesState";
import { IMyOrderState } from "./MyOrderState";

export interface IAppState {
    combinedData: ICombinedDataState;
    capabilities: ICapabilitiesState;
    myOrder: IMyOrderState;
}