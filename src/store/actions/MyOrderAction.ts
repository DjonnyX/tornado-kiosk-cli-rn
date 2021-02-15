import { Action } from "redux";
import { ICompiledProduct, IOrderPosition } from "@djonnyx/tornado-types";
import { IPositionWizard } from "../../core/interfaces";

export enum MyOrderActionTypes {
    EDIT = "TORNADO/my-order/edit",
    EDIT_CANCEL = "TORNADO/my-order/edit-cancel",
    ADD = "TORNADO/my-order/add",
    UPDATE = "TORNADO/my-order/update",
    REMOVE = "TORNADO/my-order/remove",
    CLEAR = "TORNADO/my-order/clear",
    UPDATE_STATE_ID = "TORNADO/my-order/update-state-id",
}

interface IMyOrderActionEdit extends Action<MyOrderActionTypes.EDIT> {
    product: ICompiledProduct;
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

interface IMyOrderActionClear extends Action<MyOrderActionTypes.CLEAR> { }

interface IMyOrderActionUpdateStateId extends Action<MyOrderActionTypes.UPDATE_STATE_ID> {
    stateId: number;
}

export class MyOrderActions {
    static updateStateId = (stateId: number): IMyOrderActionUpdateStateId => ({
        type: MyOrderActionTypes.UPDATE_STATE_ID,
        stateId,
    });

    static edit = (product: ICompiledProduct): IMyOrderActionEdit => ({
        type: MyOrderActionTypes.EDIT,
        product,
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

    static reset = (): IMyOrderActionClear => ({
        type: MyOrderActionTypes.CLEAR,
    });
}

export type TMyOrderActions = IMyOrderActionEdit | IMyOrderActionEditCancel | IMyOrderActionAdd | IMyOrderActionRemove
    | IMyOrderActionUpdateStateId | IMyOrderActionClear;