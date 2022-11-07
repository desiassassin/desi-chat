import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { user } from "./reducers";

const reducer = combineReducers({ user });
const store = createStore(reducer, composeWithDevTools(applyMiddleware()));

export default store;
