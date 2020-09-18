import { createStore, applyMiddleware, combineReducers } from "redux";
import { combinedDataReducer } from "./reducers";
import thunk from "redux-thunk";

const reducers = combineReducers({
	combinedDataReducer,
});

export const store = createStore(reducers, applyMiddleware(thunk));