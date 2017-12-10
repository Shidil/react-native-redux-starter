import * as React from "react";
import { connect } from "react-redux";
import Home from "../../stories/screens/Home";
import datas from "./data";
import { fetchList } from "./actions";
export interface Props {
	navigation: any;
	fetchList: Function;
	data: Object;
}
export interface State {}
class HomeContainer extends React.Component<Props, State> {
	componentDidMount() {
		this.props.fetchList(datas);
	}
	render() {
		return <Home navigation={this.props.navigation} list={this.props.data} />;
	}
}

function bindAction(dispatch) {
	return {
		fetchList: url => dispatch(fetchList(url)),
	};
}

const mapStateToProps = state => ({
	data: state.home.list,
	isLoading: state.home.isLoading,
});
export default connect(mapStateToProps, bindAction)(HomeContainer);
