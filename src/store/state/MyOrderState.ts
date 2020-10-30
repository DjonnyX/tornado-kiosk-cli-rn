import { IOrderPosition } from "@djonnyx/tornado-types";

export interface IMyOrderState {
    _nextPositionIndex: number;
    positions: Array<IOrderPosition>;
    isReseted: boolean;
}