import { ICombinedDataState } from "./CombinedDataState";
import { ICapabilitiesState } from "./CapabilitiesState";
import { IMyOrderState } from "./MyOrderState";
import { ISystemState } from "./SystemState";
import { INotificationState } from "./NotificationState";

export interface IAppState {
    combinedData: ICombinedDataState;
    capabilities: ICapabilitiesState;
    myOrder: IMyOrderState;
    system: ISystemState;
    notification: INotificationState;
}