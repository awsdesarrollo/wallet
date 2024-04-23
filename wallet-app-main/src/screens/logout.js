import React from 'react';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { FirebaseService } from '#/services';
import { Socket, SocketEvents } from '#/utils';

class Logout extends React.Component {

	componentDidMount() {
		this.props.navigation.setParams({
			hideHeader: true
		});

		this.load();
	}

	load = async () => {
		try {
			Socket.emit(SocketEvents.AUTH.LOGOUT, { user_id: this.props.user?.id });

			await FirebaseService.delete({
				token: this.props.firebase,
				user_id: this.props.user?.id,
				withoutError: true
			});
		}
		catch(e) {
			console.log(e);
		}

		await this.props.dispatch({ type: 'SET_USER', payload: null });
		await this.props.dispatch({ type: 'SET_JWT', payload: null });
		await this.props.dispatch({ type: 'SET_APPOINTMENT', payload: null });
		await this.props.dispatch({ type: 'SET_LAST_NOTIFICATION', payload: null });

		this.props.navigation.replace('Login');
	}

	render() {
		return null;
	}
}

export default connect(state => {
	return {
		user: state.user,
		firebase: state.firebase
	}
})(Logout);