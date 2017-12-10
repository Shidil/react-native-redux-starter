import { createLogger} from "redux-logger";
import { AsyncStorage } from "react-native";
import devTools from "remote-redux-devtools";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { persistStore } from "redux-persist";
import { apiMiddleware } from "redux-api-middleware";
import reducer from "../reducers";

const middlewares = [
  thunk,
  apiMiddleware,
  createLogger(),
];

export default function configureStore(onCompletion: () => void): any {
	const enhancer = compose(
		applyMiddleware(...middlewares),
		devTools({
			name: "nativestarterkit",
			realtime: true,
		}),
	);

	const store = createStore(reducer, enhancer);
	persistStore(store, { storage: AsyncStorage }, onCompletion);

	return store;
}
