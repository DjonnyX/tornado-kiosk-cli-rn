import { Action } from "redux";
import { IOrderPosition } from "@djonnyx/tornado-types";

export enum MyOrderActionTypes {
    ADD_POSITION = "TORNADO/my-order/add-position",
    UPDATE_POSITION = "TORNADO/my-order/update-position",
    REMOVE_POSITION = "TORNADO/my-order/remove-position",
}

interface IMyOrderActionAddPosition extends Action<MyOrderActionTypes> {
    position: IOrderPosition;
}

interface IMyOrderActionUpdatePosition extends Action<MyOrderActionTypes> {
    position: IOrderPosition;
}

interface IMyOrderActionRemovePosition extends Action<MyOrderActionTypes> {
    position: IOrderPosition;
}

export class MyOrderActions {
    static addPosition = (position: IOrderPosition): IMyOrderActionAddPosition => ({
        type: MyOrderActionTypes.ADD_POSITION,
        position,
    });

    static updatePosition = (position: IOrderPosition): IMyOrderActionUpdatePosition => ({
        type: MyOrderActionTypes.UPDATE_POSITION,
        position,
    });

    static removePosition = (position: IOrderPosition): IMyOrderActionRemovePosition => ({
        type: MyOrderActionTypes.REMOVE_POSITION,
        position,
    });
}

export type TMyOrderActions = IMyOrderActionAddPosition | IMyOrderActionUpdatePosition | IMyOrderActionRemovePosition;