import React from 'react';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import { Constants, Socket, SocketEvents } from '../utils';
import { AuthService, ConfigService } from '../services';
import { store } from '../store';

class Init extends React.Component {

	async componentDidMount() {
		this.props.navigation.setParams({
			hideHeader: true
		});

		this.checkLastNotification();
		this.load();
		this.checkUpdates();
	}

	initSocket = () => {
		Socket.on(SocketEvents.USER.UPDATED_USER, (data) => {
			const currentUserId = store.getState().user?.id;
			if (data.user_id === currentUserId) this.refreshProfile();
		});
		Socket.on(SocketEvents.ORDER.APPROVED, (data) => {
			// No necesita recargar el perfil, a menos que haya un efecto en el mismo
		});
		Socket.on(SocketEvents.ORDER.REJECTED, (data) => {
			const currentUserId = store.getState().user?.id;
			if (data.user_id === currentUserId) this.refreshProfile();
		});
	}

	load = async () => {
		this.initSocket();
		if (!this.props.user) {
			this.props.navigation.replace('Welcome');
		} else {
			await this.refreshProfile();
			if (this.props.user.level_id == Constants.LEVELS.CLIENT) {
				Socket.emit(SocketEvents.AUTH.LOGIN, { user_id: this.props.user.id });
				this.props.navigation.replace('ClientDrawer');
			}
		}
	}

	refreshProfile = async () => {
		try {
			const res = await AuthService.profile.get();
			this.props.dispatch({ type: 'SET_USER', payload: res.user.user });

		} catch (error) {
			console.log(error)
		}
	}

	checkLastNotification = async () => {
		try {
      const message = await AsyncStorage.getItem('last_notification');
			if (!!message) {
				await AsyncStorage.removeItem('last_notification');
				await this.props.dispatch({ type: 'SET_LAST_NOTIFICATION', payload: message });
			}

		} catch (error) {
			
		}
	}

	checkUpdates = async () => {
		try {
			const res = await ConfigService.checkUpdates({
				platform: Platform.OS,
				version: Platform.OS === 'ios' ? Config.APP_IOS_VERSION : Config.APP_ANDROID_VERSION,
			});

			if (res.mustUpdate) {
				this.props.navigation.replace('VersionControl');
				return;
			}
		}
		catch(e) {
			console.log(e);
		}
	}

	render() {
		return null;
	}
}

export default connect(state => {
	return {
		user: state.user
	}
})(Init);