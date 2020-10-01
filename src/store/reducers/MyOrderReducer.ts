import { Reducer } from "redux";
import { TMyOrderActions, MyOrderActionTypes } from "../actions";
import { IMyOrderState } from "../state";

const initialState: IMyOrderState = {
    positions: [],
};

const myOrderReducer: Reducer<IMyOrderState, TMyOrderActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case MyOrderActionTypes.ADD_POSITION:
            return {
                ...state,
                positions: [...state.positions, (action as any).position],
            };
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