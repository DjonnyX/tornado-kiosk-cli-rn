import { Action } from "redux";
import { ICompiledMenuNode, ICompiledProduct } from "@djonnyx/tornado-types";
import { IPositionWizard } from "../../core/interfaces";

export enum MyOrderActionTypes {
    EDIT_PRODUCT = "TORNADO/my-order/edit-product",
    EDIT_CANCEL = "TORNADO/my-order/edit-cancel",
    ADD = "TORNADO/my-order/add",
    UPDATE = "TORNADO/my-order/update",
    REMOVE = "TORNADO/my-order/remove",
    RESET = "TORNADO/my-order/reset",
    UPDATE_STATE_ID = "TORNADO/my-order/update-state-id",
}

interface IMyOrderActionEdit extends Action<MyOrderActionTypes.EDIT_PRODUCT> {
    productNode: ICompiledMenuNode<ICompiledProduct>;
}

interface IMyOrderActionEditCancel extends Action<MyOrderActionTypes.EDIT_CANCEL> {
    remove?: boolean;
}

interface IMyOrderActionAdd extends Action<MyOrderActionTypes.ADD> {
    position: IPositionWizard;
}

interface IMyOrderActionUpdate extends Action<MyOrderActionTypes.UPDATE> {
    position: IPositionWizard;
}

interface IMyOrderActionRemove extends Action<MyOrderActionTypes.REMOVE> {
    position: IPositionWizard;
}

interface IMyOrderActionReset extends Action<MyOrderActionTypes.RESET> { }

interface IMyOrderActionUpdateStateId extends Action<MyOrderActionTypes.UPDATE_STATE_ID> {
    stateId: number;
}

export class MyOrderActions {
    static updateStateId = (stateId: number): IMyOrderActionUpdateStateId => ({
        type: MyOrderActionTypes.UPDATE_STATE_ID,
        stateId,
    });

    static edit = (productNode: ICompiledMenuNode<ICompiledProduct>): IMyOrderActionEdit => ({
        type: MyOrderActionTypes.EDIT_PRODUCT,
        productNode,
    });

    static editCancel = (remove: boolean = false): IMyOrderActionEditCancel => ({
        type: MyOrderActionTypes.EDIT_CANCEL,
        remove,
    });

    static add = (position: IPositionWizard): IMyOrderActionAdd => ({
        type: MyOrderActionTypes.ADD,
        position,
    });

    static remove = (position: IPositionWizard): IMyOrderActionRemove => ({
        type: MyOrderActionTypes.REMOVE,
        position,
    });

    static reset = (): IMyOrderActionReset => ({
        type: MyOrderActionTypes.RESET,
    });
}

export type TMyOrderActions = IMyOrderActionEdit | IMyOrderActionEditCancel | IMyOrderActionAdd | IMyOrderActionRemove
    | IMyOrderActionUpdateStateId | IMyOrderActionReset;