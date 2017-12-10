import React from "react";
import { StackNavigator } from "react-navigation";
import { Root } from "native-base";

import Home from "./container/HomeContainer";
import BlankPage from "./container/BlankPageContainer";

const App = StackNavigator(
	{
		BlankPage: { screen: BlankPage },
		Home: { screen: Home },
	},
	{
		initialRouteName: "Home",
		headerMode: "none",
	},
);

export default () => (
	<Root>
		<App />
	</Root>
);
