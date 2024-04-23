import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ClientDrawer from './client';
import { Socket, SocketEvents, Constants, Globals } from '#/utils';
import Header from './header';
import { BackHandler } from 'react-native';
import { navigationRef } from './root-navigation';
import { CommonActions } from '@react-navigation/native';
import { Alert } from '#/utils';
import FirebaseContainer from './firebase';
import { connect } from 'react-redux';

const Stack = createStackNavigator();

import InitScreen from '#screens/init';
import FullscreenImageScreen from '#/screens/fullscreen-image';
import VersionControl from '#/screens/version-control';
import Welcome from '#/screens/welcome';

// Auth
import LoginScreen from '#/screens/auth/login';
import RecoverScreen from '#/screens/auth/recover';
import RegisterScreen from '#/screens/auth/register';
import LogoutScreen from '#/screens/logout';

const screenOptions = ({ navigation }) => ({
	header: (props) => (
		<Header
			{...props}
			navigation={navigation} />
	)
});

class Container extends React.Component {

	constructor(props) {
		super(props);

		BackHandler.addEventListener("hardwareBackPress", () => {
			Alert.confirm('¿Desea salir de la aplicación?', () => {
				BackHandler.exitApp();
			});
			return true;
		});
	}

	componentDidMount() {
		const navigation = navigationRef?.current;

		this.loadSocketsRoutes(navigation);
	}

	loadSocketsRoutes = (navigation) => {
		Socket.on(SocketEvents.USER.DISABLE_USER, (data) => {
			if (data.user_id === this.props.user.id) {
				if (data.status === Constants.USER.STATUS.DISABLED) {
					navigation?.dispatch(
						CommonActions.navigate({
							name: 'Logout'
						})
					);
					Globals.sendToast('Su usuario ha sido restringido')
				}
			}
		});
	}

	render() {
		return (
			<NavigationContainer ref={navigationRef}>
				<FirebaseContainer>
					<Stack.Navigator initialRouteName="Init" screenOptions={screenOptions}>
						<Stack.Screen name="Init" component={InitScreen} />
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Recover" component={RecoverScreen} />
						<Stack.Screen name="Register" component={RegisterScreen} />
						<Stack.Screen name="ClientDrawer" component={ClientDrawer} options={{ headerShown: false }} />
						<Stack.Screen name="FullscreenImage" component={FullscreenImageScreen} />
						<Stack.Screen name="Logout" component={LogoutScreen} />
						<Stack.Screen name="VersionControl" component={ VersionControl } />
						<Stack.Screen name="Welcome" component={ Welcome } />
					</Stack.Navigator>
				</FirebaseContainer>
			</NavigationContainer>
		)
	}
}

export default connect((state) => {
	return {
		user: state.user
	}
})(Container);

export {
	Header,
	screenOptions
}