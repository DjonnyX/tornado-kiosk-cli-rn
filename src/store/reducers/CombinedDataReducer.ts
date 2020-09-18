import { Reducer } from "redux";
import { TCombinedDataActions, CombinedDataActionTypes } from "../actions";
import { ICombinedDataState } from "../state";

const initialState: ICombinedDataState = {
	data: null,
};

const combinedDataReducer: Reducer<ICombinedDataState, TCombinedDataActions> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case CombinedDataActionTypes.SET_DATA:
			return {
				...state,
				data: action.data,
			};
		default:
			return state;
	}
};

export default combinedDataReducer;