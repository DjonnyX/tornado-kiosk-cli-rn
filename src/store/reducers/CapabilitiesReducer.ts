import { Reducer } from "redux";
import { TCapabilitiesActions, CapabilitiesActionTypes } from "../actions";
import { ICapabilitiesState } from "../state";

const initialState: ICapabilitiesState = {
    defaultLanguageCode: undefined,
};

const capabilitiesReducer: Reducer<ICapabilitiesState, TCapabilitiesActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case CapabilitiesActionTypes.SET_DEFAULT_LANGUAGE_CODE:
            return {
                ...state,
                defaultLanguageCode: (action as any).defaultLanguageCode,
            };
        default:
            return state;
    }
};

export default capabilitiesReducer;