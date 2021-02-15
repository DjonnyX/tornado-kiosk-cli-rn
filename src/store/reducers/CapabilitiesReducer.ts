import { Reducer } from "redux";
import { TCapabilitiesActions, CapabilitiesActionTypes } from "../actions";
import { ICapabilitiesState } from "../state";

const initialState: ICapabilitiesState = {
    language: undefined,
    orderType: undefined,
    currentScreen: undefined,
    navigator: undefined,
};

const capabilitiesReducer: Reducer<ICapabilitiesState, TCapabilitiesActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case CapabilitiesActionTypes.SET_LANGUAGE:
            return {
                ...state,
                language: action.language,
            };
        case CapabilitiesActionTypes.SET_ORDER_TYPE:
            return {
                ...state,
                orderType: action.orderType,
            };
        case CapabilitiesActionTypes.SET_CURRENT_SCREEN:
            return {
                ...state,
                navigator: action.navigator,
                currentScreen: action.currentScreen,
            };
        default:
            return state;
    }
};

export default capabilitiesReducer;