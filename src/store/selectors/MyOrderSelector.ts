import { createSelector } from "reselect";
import { OrderWizard } from "../../core/order/OrderWizard";
import { IAppState } from "../state";

const getMyOrder = (state: IAppState) => state.myOrder;

export namespace MyOrderSelectors {
    export const selectStateId = createSelector(getMyOrder, (state) => {
        return state.stateId;
    });

    export const selectSum = createSelector(getMyOrder, (state) => {
        return OrderWizard.current.sum;
    });

    export const selectPositions = createSelector(getMyOrder, (state) => {
        return OrderWizard.current.positions;
    });

    export const selectEditedPosition = createSelector(getMyOrder, (state) => {
        return OrderWizard.current.currentPosition;
    });
}