import { Reducer } from "redux";
import { TCapabilitiesActions, CapabilitiesActionTypes } from "../actions";
import { ICapabilitiesState } from "../state";

const initialState: ICapabilitiesState = {
    language: undefined,
    orderType: undefined,
};

const capabilitiesReducer: Reducer<ICapabilitiesState, TCapabilitiesActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case CapabilitiesActionTypes.SET_LANGUAGE:
            return {
                ...state,
                language: (action as any).language,
            };
        case CapabilitiesActionTypes.SET_ORDER_TYPE:
            return {
                ...state,
                orderType: (action as any).orderType,
            };
        default:
            return state;
    }
};

export default capabilitiesReducer;