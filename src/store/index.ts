import { createStore, combineReducers } from "redux";
import { combinedDataReducer, capabilitiesReducer, myOrderReducer, systemReducer, notificationReducer } from "./reducers";
import { IAppState } from "./state";

const reducers = combineReducers<IAppState>({
	combinedData: combinedDataReducer,
	capabilities: capabilitiesReducer,
	myOrder: myOrderReducer,
	system: systemReducer,
	notification: notificationReducer,
});

export const store = createStore(reducers);