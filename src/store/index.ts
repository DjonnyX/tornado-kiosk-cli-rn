import { createStore, applyMiddleware, combineReducers } from "redux";
import { combinedDataReducer } from "./reducers";
import { IAppState } from "./state";

const reducers = combineReducers<IAppState>({
	combinedData: combinedDataReducer,
});

export const store = createStore(reducers);