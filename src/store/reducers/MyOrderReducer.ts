import { Reducer } from "redux";
import { OrderWizard } from "../../core/order/OrderWizard";
import { TMyOrderActions, MyOrderActionTypes } from "../actions";
import { IMyOrderState } from "../state";

const initialState: IMyOrderState = {
    stateId: -1,
};

const myOrderReducer: Reducer<IMyOrderState, TMyOrderActions> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case MyOrderActionTypes.EDIT_PRODUCT:
            OrderWizard.current.editProduct(action.product);
            return state;
        case MyOrderActionTypes.EDIT_CANCEL:
            OrderWizard.current.editCancel();
            return state;
        case MyOrderActionTypes.ADD:
            OrderWizard.current.add(action.position);
            return state;
        case MyOrderActionTypes.REMOVE:
            OrderWizard.current.remove(action.position);
            return state;
        case MyOrderActionTypes.RESET:
            OrderWizard.current.reset();
            return state;
        case MyOrderActionTypes.UPDATE_STATE_ID:
            return {
                ...state,
                stateId: action.stateId,
            };
        default:
            return state;
    }
};

export default myOrderReducer;