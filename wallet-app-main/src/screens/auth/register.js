import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { navigationRef } from '#/navigation/root-navigation';
import { CommonActions } from '@react-navigation/native';
import { ScreenContainer, Button, Input } from '#/components';
import { Colors, Fonts, Media, Globals } from '#/utils';
import { AuthService } from '#/services';
import { CameraIcon, SavedIcon, UserIcon } from '#/assets/icons';

const TABS = {
  PROFILE: 1,
  BANK: 2,
}

class Register extends React.Component {

	state = {
    tab: TABS.PROFILE,
    showModal: false,
		form: {
			photo: '',
			name: '',
			lastname: '',
			document: '',
			documentPhoto: '',
			country: '',
			address: '',
			phone: '',
			email: '',
			password: '',
			password_confirmation: '',
      bankName: '',
      bankNumber: '',
      bankRoute: '',
		},
	}

	componentDidMount() {
		this.props.navigation.setParams({
			title: 'Registro',
      titleStyle: {
        fontSize: 20,
        fontFamily: Fonts.BOLD,
        lineHeight: 22,
      },
      backAction: this.backHandler,
		});
	}

  backHandler = () => {
    if (this.state.tab === TABS.BANK) {
      this.setTab(TABS.PROFILE);
    } else {
      this.props.navigation.goBack();
    }
  }

  isValidForm = (showError = true) => {
		const { form, tab } = this.state;

    const onError = (msg) => {
      if (showError) Globals.sendToast(msg);
      return false;
    }

    if (tab === TABS.PROFILE) {
      if (!form.name)
        return onError('El nombre es obligatorio');

      if (!form.lastname)
        return onError('El apellido es obligatorio');

      if (!form.phone)
        return onError('El teléfono es obligatorio');

      if (!form.email)
        return onError('El correo es obligatorio');

      if (!form.address)
        return onError('La dirección es obligatoria');

      if (!form.password)
        return onError('La contraseña es obligatoria');

      if (form.password_confirmation !== form.password)
        return onError('Las contraseñas no coinciden');
    }

    if (tab === TABS.BANK) {
      if (!form.bankName)
        return onError('El nombre del banco es obligatorio');

      if (!form.bankNumber)
        return onError('El número de cuenta es obligatorio');

      if (!form.bankRoute)
        return onError('El número de ruta es obligatorio');
    }

    return true;
  }

	submit = async () => {
    if (!this.isValidForm()) return;

    try {
      const res = await AuthService.register({
        ...this.state.form,
        hasFile: true,
      });

      Globals.sendToast('Cuenta creada con éxito');
      // if (res.user) {
      //   await this.props.dispatch({
      //     type: 'SET_USER',
      //     payload: res.user
      //   });

      //   try {
      //     await FirebaseService.create({
      //       token: this.props.firebase,
      //       user_id: res.user.id,
      //       withoutLoading: true
      //     });
      //   } catch (e) {
      //     console.log(e);
      //   }
      // }

      const navigation = navigationRef?.current;
      this.setState({ showModal: true });

      setTimeout(() => {
        this.setState({ showModal: false });
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          })
        );
      }, 3000);

    } catch (error) {

    }
	}

  setTab = (tab) => {
    this.setState({ tab });
  }

	change = (value, target) => {
		this.setState({
			form: {
				...this.state.form,
				[target]: value
			}
		});
	}

	selectPhoto = (field) => {
		Media.get()
      .then(image => {
        this.change(image, field);
      })
      .catch(e => {
        console.log(e)
        Globals.sendToast('No se pudo cargar la imagen');
      });
	}

	render() {

    const isSubmitEnabled = this.isValidForm(false);

		return (
      <ScreenContainer backgroundColor={Colors.white}>
        <Modal
          transparent={true}
          visible={this.state.showModal}
        >
          <View style={styles.backdrop}>
            <View style={styles.modal}>
              <Image source={SavedIcon} style={styles.modalImage} />
              <Text style={styles.textModal}>
                Se ha guardado{'\n'}con éxito
              </Text>
            </View>
          </View>
        </Modal>

        {this.state.tab === TABS.PROFILE && (
          <View style={{ padding: 25, paddingTop: 10 }}>
            <View>
              <View style={styles.photoWrapper}>
                <TouchableOpacity style={styles.photo} onPress={() => this.selectPhoto('photo')}>
                  <Image
                    style={styles.image(!this.state.form.photo)}
                    source={this.state.form.photo || UserIcon}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.bannerPhotoBtn}
                onPress={() => this.selectPhoto('photo')}
                activeOpacity={0.8}
              >
                <Text style={styles.bannerPhotoBtnText}>Foto de perfil</Text>
              </TouchableOpacity>
            </View>
            <Input
              placeholder="Nombres"
              placeholderTextColor={Colors.black}
              style={styles.input}
              inputStyle={styles.inputStyle}
              value={this.state.form.name}
              onChangeText={e => this.change(e, 'name')}
            />
            <Input
              placeholder="Apellidos"
              placeholderTextColor={Colors.black}
              style={styles.input}
              inputStyle={styles.inputStyle}
              value={this.state.form.lastname}
              onChangeText={e => this.change(e, 'lastname')}
            />

            <Input
              placeholder="ID / Pasaporte"
              placeholderTextColor={Colors.black}
              style={styles.input}
              inputStyle={styles.inputStyle}
              value={this.state.form.document}
              onChangeText={e => this.change(e, 'document')}
            />

            <TouchableOpacity
              style={styles.inputFile}
              onPress={() => this.selectPhoto('documentPhoto')}
            >
              <View style={styles.inputFilePhoto}>
                <Image
                  style={styles.documentPhoto(!this.state.form.documentPhoto)}
                  source={this.state.form.documentPhoto || CameraIcon}
                />
              </View>
              <Text style={{ color: Colors.white, fontSize: 16 }}>Subir imagen del documento</Text>
            </TouchableOpacity>

            <Input
              placeholder="País de origen"
              placeholderTextColor={Colors.black}
              style={styles.input}
              inputStyle={styles.inputStyle}
              value={this.state.form.country}
              onChangeText={e => this.change(e, 'country')}
            />
            <Input
              placeholder="Dirección"
              placeholderTextColor={Colors.black}
              style={styles.input}
              inputStyle={styles.inputStyle}
              value={this.state.form.address}
              onChangeText={e => this.change(e, 'address')}
            />

            <Input
              placeholder="Teléfono"
              placeholderTextColor={Colors.black}
              style={styles.input}
              inputStyle={styles.inputStyle}
              value={this.state.form.phone}
              onChangeText={e => this.change(e, 'phone')}
              keyboardType="phone-pad"
            />

            <Input
              placeholder="Correo electrónico"
              placeholderTextColor={Colors.black}
              style={styles.input}
              inputStyle={styles.inputStyle}
              value={this.state.form.email}
              onChangeText={e => this.change(e, 'email')}
            />
            <Input
              secureTextEntry={true}
              placeholderTextColor={Colors.black}
              onChangeText={e => this.change(e, 'password')}
              placeholder="Contraseña"
              style={styles.input}
              inputStyle={styles.inputStyle}
            />
            <Input
              secureTextEntry={true}
              placeholderTextColor={Colors.black}
              onChangeText={e => this.change(e, 'password_confirmation')}
              placeholder="Repetir contraseña"
              style={styles.input}
              inputStyle={styles.inputStyle}
            />

            <View style={styles.buttonContainer}>
              <Button
                style={styles.button(isSubmitEnabled)}
                onPress={() => isSubmitEnabled ? this.setTab(TABS.BANK) : this.isValidForm()}
                textStyle={styles.buttonText(isSubmitEnabled)}
                title="Siguiente"
              />
            </View>
          </View>
        )}

        {this.state.tab === TABS.BANK && (
          <View style={{ padding: 25, paddingTop: 10, flex: 1 }}>
            <Text style={styles.bankTitle}>Datos Bancarios</Text>

            <View>
              <Input
                placeholder="Cuenta Bancaria"
                placeholderTextColor={Colors.black}
                style={styles.input}
                inputStyle={styles.inputStyle}
                value={this.state.form.bankNumber}
                onChangeText={e => this.change(e, 'bankNumber')}
                keyboardType="number-pad"
                maxLength={20}
              />
              <Input
                placeholder="Código SWIFT / BIC"
                placeholderTextColor={Colors.black}
                style={styles.input}
                inputStyle={styles.inputStyle}
                value={this.state.form.bankName}
                onChangeText={e => this.change(e, 'bankName')}
                maxLength={11}
              />
              <Input
                placeholder="ACH routing number(ABA)"
                placeholderTextColor={Colors.black}
                style={styles.input}
                inputStyle={styles.inputStyle}
                value={this.state.form.bankRoute}
                onChangeText={e => this.change(e, 'bankRoute')}
                maxLength={9}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                style={styles.button(isSubmitEnabled)}
                onPress={this.submit}
                textStyle={styles.buttonText(isSubmitEnabled)}
                title="Guardar"
              />
            </View>
          </View>
        )}
      </ScreenContainer>
		)
	}
}

const styles = StyleSheet.create({
  bannerPhotoBtn: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: '#002DB2',
    borderRadius: 10,
  },
  bannerPhotoBtnText: {
    fontFamily: Fonts.SEMIBOLD,
    color: '#002DB2',
  },
  bankTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    fontFamily: Fonts.SEMIBOLD,
    color: Colors.text,
  },
  comboInput: {
    flexDirection: 'row',
    flex: 1,
  },
  inputComboLeft: {
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputComboRight: {
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  inputFile: {
    borderRadius: 16,
    backgroundColor: Colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
  },
  inputFilePhoto: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
	directionsModal: {
		padding: 0,
		paddingBottom: 15,
		alignSelf: 'center',
		borderRadius: 10,
		width: '90%',
		backgroundColor: Colors.white,
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40
	},
	map: {
		marginTop: 15,
		backgroundColor: Colors.gray2,
		height: 150,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
	},
	bg: {
		width: '100%',
		height: '100%',
		paddingBottom: 20
	},
	imageBg: {
		height: '70%'
	},
  button: (isEnabled) => ({
    width: 150,
    backgroundColor: isEnabled ? Colors.green : Colors.gray2,
    borderRadius: 20,
  }),
	buttonText: (isEnabled) => ({
		textAlign: 'center',
		fontFamily: Fonts.BOLD,
		color: isEnabled ? Colors.white : Colors.gray3,
	}),
	buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
		marginTop: 20,
		alignItems: 'center',
	},
	container: {
		width: '90%',
		alignSelf: 'center'
	},
	input: {
		borderWidth: 1,
		borderColor: Colors.gray2,
    borderRadius: 20,
    marginBottom: 15,
	},
  inputStyle: {
    paddingHorizontal: 10,
  },
	title: {
		color: Colors.white,
		textAlign: 'center',
		marginVertical: 20,
		fontSize: 16,
		fontFamily: Fonts.BOLD
	},
	logo: {
		width: 90,
		height: 90,
		marginTop: 30,
		alignSelf: 'center'
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
	backgroundStyles: {
		backgroundColor: Colors.red,
		borderBottomLeftRadius: 40,
		borderBottomRightRadius: 40,
		height: '25%',
		width: '100%'
	},
	userIcon: {
		width: 120,
		height: 120
	},
	userIconPhoto: {
		width: 120,
		height: 120,
		borderRadius: 100
	},
	userIconParent: {
		backgroundColor: Colors.white,
		borderColor: Colors.white,
		borderWidth: 10,
		borderRadius: 100,
		alignSelf: 'center',
	},
	userIconParentAtPhoto: {
		alignSelf: 'center',
		backgroundColor: Colors.white,
		borderColor: Colors.white,
		borderWidth: 10,
		borderRadius: 100,
	},
	iconEdit: {
		backgroundColor: Colors.white,
		borderColor: Colors.white,
		borderWidth: 10,
		borderRadius: 30,
		alignSelf: 'center',
		marginTop: -30,
		marginLeft: 80
	},
	iconEditSon: {
		width: 20,
		height: 20,
	},
	lineContainer: {
		alignItems: 'center',
	},
	buttonContainerSocial: {
		marginBottom: 20,
		alignSelf: 'center'
	},
	buttonSocialText: {
		textAlign: 'center',
		fontFamily: Fonts.BOLD,
		color: Colors.black
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
  photoWrapper: {
    width: 124,
    height: 124,
    borderWidth: 2,
    borderColor: Colors.blue,
    borderRadius: 124/2,
    backgroundColor: Colors.blue,
    marginBottom: 50,
    alignSelf: 'center',
  },
  photo: {
		width: 120,
		height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    backgroundColor: Colors.lightBlue,
		borderColor: Colors.white,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
	image: (isPlaceholder) => ({
		width: isPlaceholder ? 50 : 120,
		height: isPlaceholder ? 50 : 120,
		resizeMode: 'cover',
	}),
	documentPhoto: (isPlaceholder) => ({
		width: isPlaceholder ? 22 : '100%',
		height: isPlaceholder ? 22 : '100%',
		resizeMode: 'cover',
	}),
	company_container: {
		padding: 10,
		backgroundColor: Colors.blue,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10
	},
	company_text: {
		color: Colors.white
	},
	bottom_icon: {
		width: 15,
		height: 15,
		tintColor: Colors.white,
		resizeMode: 'contain'
	}
});

export default connect(state => {
	return {
		firebase: state.firebase,
	}
})(Register);