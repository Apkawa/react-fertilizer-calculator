import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { reducer as calculateReducer } from "../components/Calculator/reducers";

export const rootReducers = combineReducers({
  calculator: calculateReducer,
  form: formReducer,
});
