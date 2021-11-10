import { IOrderWizard } from "../../core/interfaces";

export interface IMyOrderState {
    stateId: number;
    wizard: IOrderWizard | undefined;
    showOrderTypes: boolean;
    isProcessing: boolean;
}
