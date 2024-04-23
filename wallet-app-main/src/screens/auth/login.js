import React from 'react';
import { Input } from '#/components';
import { Colors, Fonts, Constants, Globals } from '../../utils';
import { StyleSheet, View, TouchableOpacity, Text, Image, PixelRatio } from 'react-native';
import { AuthService, FirebaseService } from '#/services';
import { connect } from 'react-redux';
import { navigationRef } from '#/navigation/root-navigation';
import { CommonActions } from '@react-navigation/native';
import { LoginBackground, Logo } from '#/assets/img';
import { DoneIcon } from '#/assets/icons';

const fontSize = Constants.FONTSIZE * PixelRatio.getFontScale() / Constants.FONTSIZEDIV

class LoginScreen extends React.Component {

	state = {
		form: {
			email: this.props.remember ?? '',
			password: '',
			remember: !!this.props.remember,
		},
		accessData: false,
		visible_pass: true
	}

	componentDidMount() {
		this.props.navigation.setParams({
			hideHeader: true
		});
	}

	change = (value, target) => {
		this.setState({
			form: {
				...this.state.form,
				[target]: value
			}
		});
	}

	register = () => {
		this.props.navigation.navigate('Register');
	}

	recover = () => {
		this.props.navigation.navigate('Recover');
	}

	isValidForm = () => {
		const onError = (message) => {
			Globals.sendToast(message);
			return false;
		}

		if (!this.state.form.email)
			return onError('Ingrese su correo electrónico');

		if (!this.state.form.password)
			return onError('Ingrese su contraseña');

		return true;
	}

	submit = async () => {
		if (!this.isValidForm()) return;

		const res = await AuthService.login({
			...this.state.form
		});
		this.setUser(res.user.user);

		await this.props.dispatch({
			type: 'SET_JWT',
			payload: res.user.token
		});

		await this.props.dispatch({
			type: 'SET_REMEMBER',
			payload: this.state.form.remember ? this.state.form.email : '',
		});

		await this.props.dispatch({
			type: 'SET_LAST_NOTIFICATION',
			payload: '',
		});
	}

	setUser = async (user) => {
		const navigation = navigationRef?.current;

		await this.props.dispatch({
			type: 'SET_USER',
			payload: user
		});
		if (this.props.firebase) {
			await FirebaseService.create({
				token: this.props.firebase,
				user_id: user.id,
				withoutLoading: true
			});
		}

		if (user.level_id == Constants.LEVELS.CLIENT) {
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: 'ClientDrawer' }]
				})
			)
		}
	}

	render() {
		return (
			<View style={{ backgroundColor: Colors.background, flex: 1, justifyContent: 'center' }}>
				<View style={{ width: '100%', height: 'auto' }}>
					<Image source={Logo} style={styles.logoLogin} />
					<Text style={styles.title}>Ingrese a su{'\n'}cuenta</Text>
				</View>

				<View style={styles.form}>
					<Input
						style={styles.input}
						inputStyle={styles.inputStyle}
						placeholder="Correo electrónico"
						placeholderTextColor={Colors.gray3}
						value={this.state.form.email}
						onChangeText={e => this.change(e, 'email')}
					/>
					<Input
						style={styles.input}
						inputStyle={styles.inputStyle}
						secureTextEntry={this.state.visible_pass}
						placeholder="Contraseña"
						placeholderTextColor={Colors.gray3}
						onChangeText={e => this.change(e, 'password')}
					/>

					<View style={styles.buttonContainer}>
						<View style={styles.links}>
							<TouchableOpacity
								style={styles.buttonRememberContainer}
								onPress={() => this.change(!this.state.form.remember, 'remember')}
							>
								<View style={styles.rememberCheck}>
									{this.state.form.remember && (
										<Image source={DoneIcon} style={styles.rememberCheckIcon} />
									)}
								</View> 
								<Text style={styles.rememberText}>Recuérdame</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={styles.button} onPress={this.submit}>
							<Text style={styles.buttonText}>Iniciar sesión</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	logoLogin: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
		alignSelf: 'center'
	},
	title: {
		fontSize: 34,
		fontFamily: Fonts.SEMIBOLD,
		color: Colors.white,
		textAlign: 'center',
		marginVertical: 20,
	},
	input: {
		backgroundColor: '#001929',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#001929',
	},
	inputStyle: {
		paddingHorizontal: 10,
		color: Colors.white,
	},
	icon: {
		width: 22.5,
		height: 22.5,
		resizeMode: 'contain',
		position: 'absolute',
		zIndex: 1,
		alignSelf: 'flex-start',
		marginLeft: 20,
		marginTop: 6
	},
	form: {
		width: '100%',
		borderRadius: 10,
		padding: 30,
		alignSelf: 'center'
	},
	button: {
		backgroundColor: Colors.blue,
		height: 40,
		borderRadius: 20,
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	buttonText: {
		flex: 1,
		textAlignVertical: 'center',
		fontSize: 16,
		lineHeight: 18,
		color: Colors.white,
	},
	buttonSocialText: {
		textAlign: 'center',
		fontFamily: Fonts.BOLD,
		color: Colors.black
	},
	buttonContainer: {
		marginVertical: 20,
		alignItems: 'center'
	},
	rememberText: {
		textAlign: 'center',
		color: Colors.white,
		fontSize: 15,
	},
  rememberCheckIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: Colors.blue,
  },
	register: {
		textAlign: 'center',
		color: Colors.black,
		fontFamily: Fonts.BOLD,
		fontSize: 16,
		marginBottom: 20,
	},
	logo: {
		width: 200,
		height: 150,
		alignSelf: 'center',
		marginTop: 40,
		marginBottom: 30,
		resizeMode: 'contain'
	},
	links: {
		marginBottom: 20,
		alignSelf: 'center'
	},
	header: {
		padding: 20
	},
	buttonRememberContainer: {
		fontSize: fontSize,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
  rememberCheck: {
    width: 16,
    height: 16,
    backgroundColor: '#001929',
    borderColor: Colors.blue,
    borderWidth: 1,
    borderRadius: 4,
		marginRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
  },
});

export default connect(state => {
	return {
		firebase: state.firebase,
		remember: state.remember,
	}
})(LoginScreen);