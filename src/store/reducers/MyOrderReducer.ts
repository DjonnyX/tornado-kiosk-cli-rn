import { Reducer } from "redux";
import { TMyOrderActions, MyOrderActionTypes } from "../actions";
import { IMyOrderState } from "../state";

const initialState: IMyOrderState = {
    _nextPositionIndex: 0,
    positions: [],
};

const myOrderReducer: Reducer<IMyOrderState, TMyOrderActions> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case MyOrderActionTypes.ADD_POSITION:
            const existsAIndex = state.positions.findIndex(pos => pos.product.id === (action as any).product.id);

            // "слипание" продуктов
            if (existsAIndex > -1) {
                const aPos = (action as any).position;
                let aPositions = [...state.positions];
                if (existsAIndex > -1) {
                    aPositions.splice(existsAIndex, 1);
                    aPositions.splice(existsAIndex, 0, aPos);
                }
                return {
                    ...state,
                    positions: aPositions,
                };
            }
            // добавление нового продукта
            else {
                const _nextPositionIndex = state._nextPositionIndex + 1;
                return {
                    ...state,
                    _nextPositionIndex,
                    positions: [...state.positions, {id: _nextPositionIndex.toString(), product: (action as any).product, quantity: 1}],
                };
            }
        case MyOrderActionTypes.REMOVE_POSITION:
            const rPos = (action as any).position;
            const existsRIndex = state.positions.findIndex(pos => pos.id === rPos.id);
            let rPositions = [...state.positions];
            if (existsRIndex > -1) {
                rPositions.splice(existsRIndex, 1);
            }
            return {
                ...state,
                positions: rPositions,
            };
        case MyOrderActionTypes.UPDATE_POSITION:
            const uPos = (action as any).position;
            const existsUIndex = state.positions.findIndex(pos => pos.id === uPos.id);
            let uPositions = [...state.positions];
            if (existsUIndex > -1) {
                uPositions.splice(existsUIndex, 1);
                uPositions.splice(existsUIndex, 0, uPos);
            }
            return {
                ...state,
                positions: uPositions,
            };
        default:
            return state;
    }
};

export default myOrderReducer;