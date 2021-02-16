import { createSelector } from "reselect";
import { IAppState } from "../state";

const getMyOrder = (state: IAppState) => state.myOrder;

export namespace MyOrderSelectors {
    export const selectStateId = createSelector(getMyOrder, (state) => {
        return state.stateId;
    });
}