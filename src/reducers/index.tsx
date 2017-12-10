import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import home from "../container/HomeContainer/reducer";

export default combineReducers({
	form: formReducer,
	home,
});
