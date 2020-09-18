import { Action } from "redux";
import { ICompiledData } from "@djonnyx/tornado-types";

export enum CombinedDataActionTypes {
    SET_DATA = "TORNADO/combined-data/set",
}

interface ICombinedDataActionSet extends Action<CombinedDataActionTypes> {
    data: ICompiledData | null;
}

export class CombinedDataActions {
    static setData = (data: ICompiledData | null): ICombinedDataActionSet => ({
        type: CombinedDataActionTypes.SET_DATA,
        data,
    });
}

export type TCombinedDataActions = ICombinedDataActionSet; // | ICombinedDataActionSet