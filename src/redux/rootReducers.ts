import {combineReducers} from "redux";
import {reducer as calculateReducer} from "../components/Calculator/reducers";
import {reducer as formReducer} from "redux-form";

export const rootReducers = combineReducers({
  calculator: calculateReducer,
  form: formReducer
})
