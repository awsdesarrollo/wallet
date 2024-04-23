import React from 'react';
import { Text, StyleSheet, View, Image, Modal, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { ScreenContainer, Button, Input } from '#/components';
import { Colors, Fonts, Alert } from '#/utils';
import { AuthService } from '#/services';
import { RecoverImage } from '#/assets/img';
import { MailIcon } from '#/assets/icons';

class Recover extends React.Component {

	state = {
		form: {
			email: ''
		},
		email: '',
		visible: false,
	}

	componentDidMount() {
		this.props.navigation.setParams({
			title: 'Recuperar contraseña',
      titleStyle: {
        fontSize: 20,
        fontFamily: Fonts.BOLD,
      },
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

	submit = async () => {
		if (!this.state.form.email) return Alert.showAlert('Debe rellenar el campo correo!');

		await AuthService.recover({
			...this.state.form
		});
		await this.setState({
			email: this.state.form.email
		});

		this.setState({
			visible: true
		}, () =>
			setTimeout(() => {
				this.setState({ visible: false });
				this.props.navigation.navigate('Login');
			}, 3000)
		);
	}

	onClose = (close = false) => {
		this.setState({
			visible: false
		}, () => {
			if (close) this.props.navigation.goBack();
		});
	}

	render() {
		return (
			<>
				<Modal
					transparent={true}
					visible={this.state.visible}
					onRequestClose={() => this.onClose(true)}
				>
					<TouchableOpacity
						style={styles.backdrop}
						onPress={() => this.onClose(true)}
						activeOpacity={1}
					>
						<View style={styles.modal}>
							<Image source={MailIcon} style={styles.modalImage} />
							<Text style={styles.textModal}>
								Se ha enviado con{'\n'}éxito a su correo
							</Text>
						</View>
					</TouchableOpacity>
				</Modal>

				<ScreenContainer backgroundColor={Colors.white} style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						<View style={{ alignSelf: 'center' }}>
							<Image source={RecoverImage} style={{ width: 100, height: 90, resizeMode: 'contain' }} />
						</View>
						<View style={{ padding: 10 }}>
							<View style={styles.form}>
								<Text style={styles.label}>Ingrese su correo electrónico y recibirá{'\n'}un enlace de acceso</Text>
								<Input
									placeholder={'Correo electrónico'}
									placeholderTextColor={Colors.black}
									style={styles.input}
									inputStyle={styles.inputStyle}
									onChangeText={e => this.change(e, 'email')}
								/>
							</View>
						</View>
						<View style={styles.buttonContainer}>
							<Button
								style={styles.button}
								onPress={this.submit}
								textStyle={styles.buttonText}
								title={'Enviar'} />
						</View>
					</View>
				</ScreenContainer>
			</>
		)
	}
}

const styles = StyleSheet.create({
	input: {
		backgroundColor: Colors.gray,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: Colors.gray3,
	},
  inputStyle: {
    paddingHorizontal: 10,
  },
	imageLike: {
		width: 80,
		height: 80,
		marginBottom: 20,
		alignSelf: 'center'
	},
	title: {
		color: Colors.yellow,
		textAlign: 'center',
		fontSize: 16,
		marginVertical: 20
	},
	form: {
		width: '100%',
		marginVertical: 10,
		borderRadius: 10,
		padding: 20,
		paddingBottom: 30
	},
	button: {
    width: 150,
    backgroundColor: Colors.green,
    borderRadius: 20,
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: Fonts.BOLD,
		color: Colors.white
	},
	buttonContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingBottom: 40,
	},
	bg: {
		width: '100%',
		height: '100%',
		paddingBottom: 20
	},
	imageBg: {
		height: '70%'
	},
	label: {
		textAlign: 'center',
		marginBottom: 20,
		color: Colors.black
	},
	icon: {
		width: 90,
		height: 90,
		alignSelf: 'center',
		marginTop: 30
	},
	backgroundStyles: {
		backgroundColor: Colors.red,
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		height: '35%',
		width: '100%'
	},
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
	modal: {
		padding: 15,
		alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingVertical: 20,
    width: '50%',
	},
	modalImage: {
		width: 50,
		height: 50,
		marginBottom: 10
	},
	textModal: {
    textAlign: 'center',
    fontSize: 16,
	},
});

export default connect(state => {
	return {
		user: state.user
	}
})(Recover);