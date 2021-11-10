import { Reducer } from "redux";
import { TMyOrderActions, MyOrderActionTypes } from "../actions";
import { IMyOrderState } from "../state";

const initialState: IMyOrderState = {
    stateId: -1,
    wizard: undefined,
    showOrderTypes: true,
    isProcessing: false,
};

const myOrderReducer: Reducer<IMyOrderState, TMyOrderActions> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case MyOrderActionTypes.SET_WIZARD:
            return {
                ...state,
                wizard: action.wizard,
            };
        case MyOrderActionTypes.RESPAWN:
            state.wizard?.respawn();
            return state;
        case MyOrderActionTypes.EDIT_PRODUCT:
            state.wizard?.editProduct(action.productNode);
            return state;
        case MyOrderActionTypes.EDIT_CANCEL:
            state.wizard?.editCancel();
            return state;
        case MyOrderActionTypes.ADD:
            state.wizard?.add(action.position);
            return state;
        case MyOrderActionTypes.REMOVE:
            state.wizard?.remove(action.position);
            return state;
        case MyOrderActionTypes.RESET:
            state.wizard?.reset();
            return state;
        case MyOrderActionTypes.SHOW_ORDER_TYPES:
            return {
                ...state,
                showOrderTypes: action.showOrderTypes,
            };
        case MyOrderActionTypes.UPDATE_STATE_ID:
            return {
                ...state,
                stateId: action.stateId,
            };
        case MyOrderActionTypes.UPDATE_IS_PROCESSING:
            return {
                ...state,
                isProcessing: action.isProcessing,
            };
        default:
            return state;
    }
};

export default myOrderReducer;