import { ICombinedDataState } from "./CombinedDataState";
import { ICapabilitiesState } from "./CapabilitiesState";

export interface IAppState {
    combinedData: ICombinedDataState;
    capabilities: ICapabilitiesState;
}