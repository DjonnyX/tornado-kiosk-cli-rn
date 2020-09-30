import { Action } from "redux";
import { ICompiledProduct } from "@djonnyx/tornado-types";

export enum MyOrderActionTypes {
    ADD_POSITION = "TORNADO/my-order/add-position",
    UPDATE_POSITION = "TORNADO/my-order/update-position",
    REMOVE_POSITION = "TORNADO/my-order/remove-position",
}

interface IMyOrderActionAddPosition extends Action<MyOrderActionTypes> {
    position: ICompiledProduct;
}

interface IMyOrderActionUpdatePosition extends Action<MyOrderActionTypes> {
    position: ICompiledProduct;
}

interface IMyOrderActionRemovePosition extends Action<MyOrderActionTypes> {
    position: ICompiledProduct;
}

export class MyOrderActions {
    static addPosition = (position: ICompiledProduct): IMyOrderActionAddPosition => ({
        type: MyOrderActionTypes.ADD_POSITION,
        position,
    });

    static updatePosition = (position: ICompiledProduct): IMyOrderActionUpdatePosition => ({
        type: MyOrderActionTypes.UPDATE_POSITION,
        position,
    });

    static removePosition = (position: ICompiledProduct): IMyOrderActionRemovePosition => ({
        type: MyOrderActionTypes.REMOVE_POSITION,
        position,
    });
}

export type TMyOrderActions = IMyOrderActionAddPosition | IMyOrderActionUpdatePosition | IMyOrderActionRemovePosition;