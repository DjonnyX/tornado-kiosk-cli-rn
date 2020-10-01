import { createSelector } from "reselect";
import { IAppState } from "../state";

const getMyOrder = (state: IAppState) => state.myOrder;

export namespace MyOrderSelectors {
    export const selectPositions = createSelector(getMyOrder, (state) => {
        return state.positions;
    });

    export const selectSum = createSelector((state: IAppState) => { return state }, (state) => {
        let sum = 0;
        const currency = state.combinedData.data?.refs.defaultCurrency;
        for (const pos of state.myOrder.positions) {
            sum += pos.prices[currency?.id as any]?.value | 0;
        }
        return sum;
    });
}