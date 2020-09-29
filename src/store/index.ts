import { createStore, combineReducers } from "redux";
import { combinedDataReducer, capabilitiesReducer } from "./reducers";
import { IAppState } from "./state";

const reducers = combineReducers<IAppState>({
	combinedData: combinedDataReducer,
	capabilities: capabilitiesReducer
});

export const store = createStore(reducers);