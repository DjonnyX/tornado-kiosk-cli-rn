import { Reducer } from "redux";
import { SystemActionTypes, TSystemActions } from "../actions/SystemAction";
import { ISystemState } from "../state";

const initialState: ISystemState = {
    deviceInfo: {
        serialNumber: undefined,
        name: undefined,
    },
};

const systemReducer: Reducer<ISystemState, TSystemActions> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case SystemActionTypes.SET_SERIAL_NUMBER:
            return {
                ...state,
                serialNumber: action.serialNumber,
            };
        case SystemActionTypes.SET_NAME:
            return {
                ...state,
                name: action.name,
            };
        default:
            return state;
    }
};

export default systemReducer;