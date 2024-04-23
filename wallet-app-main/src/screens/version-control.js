import React from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View, Linking } from 'react-native';
import Config from 'react-native-config';
import { Logo } from '#/assets/img';
import { ScreenContainer } from '#/components';
import { Colors, Fonts } from '#/utils';

class VersionControl extends React.Component {

	update = () => {
		if (Platform.OS == 'android') {
			Linking.openURL(Config.APP_LINK_ANDROID);
		} else if (Platform.OS == 'ios') {
			Linking.openURL(Config.APP_LINK_IOS);
		}
	}

	render() {
		return (
			<ScreenContainer>
				<Image source={Logo} style={styles.logo} />
				<Text style={styles.title}>Actualización requerida</Text>
				<Text style={styles.text}>
					{ Config.APP_NAME } tiene mejoras que son necesarias para el correcto funcionamiento
				</Text>
				<TouchableOpacity onPress={() => this.update()}>
					<View style={styles.containerUpdate}>
						<Text style={styles.textUpdate}>Actualizar</Text>
					</View>
				</TouchableOpacity>
			</ScreenContainer>
		)
	}
}

const styles = StyleSheet.create({
	containerUpdate: {
		padding: 10,
		backgroundColor: Colors.blue,
		alignSelf: 'center',
		marginVertical: 15,
		borderRadius: 10,
		width: 200
	},
	textUpdate: {
		fontFamily: Fonts.BOLD,
		textAlign: 'center',
		color: Colors.white
	},
	logo: {
		width: 200,
		height: 100,
		resizeMode: 'contain',
		alignSelf: 'center',
		marginTop: 20,
	},
	title: {
		textAlign: 'center',
		width: 300,
		alignSelf: 'center',
		fontFamily: Fonts.BOLD,
		marginTop: 16,
	},
	text: {
		textAlign: 'center',
		width: 300,
		alignSelf: 'center',
	}
});

export default VersionControl;