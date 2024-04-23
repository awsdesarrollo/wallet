import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Colors, Fonts, Globals } from '../../../utils';
import { Input, Menu, ScreenContainer } from '../../../components';
import { BackIcon } from '../../../assets/icons';
import { AuthService } from '../../../services';

class Profile extends React.Component {

  state = {
    form: {
      name: this.props?.user?.name,
      email: this.props?.user?.email,
      notification_config: this.props?.user?.notification_config,
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      hideHeader: true,
    });
  }

  change = async (value, target) => {
    await this.setState(s => ({
      form: { ...s.form, [target]: value }
    }));
  }

  submit = async () => {
    if (!this.state.form.email)
      return Globals.sendToast('Debe indicar el correo electrónico');

    Globals.showLoading();

    try {
      await AuthService.profile.update(this.state.form);
      const res = await AuthService.profile.get();
      this.props.dispatch({ type: 'SET_USER', payload: res.user.user });
      Globals.sendToast('Correo actualizado con éxito');

    } catch (error) {
      console.log(error)
    }

    Globals.quitLoading();
  }

  render() {

    const { form } = this.state;

    return (
      <>
        <ScreenContainer backgroundColor={Colors.background}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image source={BackIcon} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
          </View>

          <View style={{ flex: 1, marginHorizontal: 20 }}>
            <Input
              style={styles.input}
              inputStyle={styles.inputStyle}
              placeholder="Correo electrónico"
              placeholderTextColor={Colors.gray3}
              value={form.email}
              onChangeText={e => this.change(e, 'email')}
            />
          </View>

          <View>
            <TouchableOpacity style={styles.button} onPress={this.submit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScreenContainer>

        <Menu />
      </>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 32,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.white,
  },
  headerTitle: {
    fontFamily: Fonts.SEMIBOLD,
    fontSize: 24,
    color: Colors.white,
    marginLeft: 20,
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
	button: {
		backgroundColor: Colors.blue,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
    marginVertical: 32,
    marginHorizontal: 20,
	},
	buttonText: {
		flex: 1,
		textAlignVertical: 'center',
		fontSize: 16,
		lineHeight: 18,
		color: Colors.white,
	},
});

export default connect((state) => ({
  user: state.user
}))(Profile);