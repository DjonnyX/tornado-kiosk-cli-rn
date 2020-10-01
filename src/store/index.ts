import { createStore, combineReducers } from "redux";
import { combinedDataReducer, capabilitiesReducer, myOrderReducer } from "./reducers";
import { IAppState } from "./state";

const reducers = combineReducers<IAppState>({
	combinedData: combinedDataReducer,
	capabilities: capabilitiesReducer,
	myOrder: myOrderReducer,
});

export const store = createStore(reducers);