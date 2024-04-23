import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Switch } from 'react-native';
import { connect } from 'react-redux';
import { Colors, Fonts, Globals } from '../../../utils';
import { Menu, ScreenContainer } from '../../../components';
import { BackIcon } from '../../../assets/icons';
import { AuthService } from '../../../services';

class ProfileNotification extends React.Component {

  state = {
    form: {
      name: this.props?.user?.name,
      email: this.props?.user?.email,
      notification_config: this.props?.user?.notification_config,
      sound: true,
      vibration: true,
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      hideHeader: true,
    });

    this.load();
  }

  load = async () => {
    const { user } = this.props;
    let sound = true;
    let vibration = true;

    switch (user.notification_config) {
      case 'none':
        sound = false;
        vibration = false;
        break;
      case 'no-sound':
        sound = false;
        break;
      case 'no-vibration':
        vibration = false;
        break;

      case 'default':
      default:
        break;
    }

    this.setState(s => ({
      form: { ...s.form, sound, vibration }
    }));
  }

  change = async (value, target) => {
    await this.setState(s => ({
      form: { ...s.form, [target]: value }
    }));
  }

  formatForm = async () => {
    const { sound, vibration } = this.state.form;
    let notification_config = 'default';

    if (sound && !vibration) {
      notification_config = 'no-vibration';
    } else if (!sound && vibration) {
      notification_config = 'no-sound';
    } else if (!sound && !vibration) {
      notification_config = 'none';
    } else {
      notification_config = 'default';
    }

    await this.setState(s => ({
      form: { ...s.form, notification_config }
    }));
  }

  submit = async () => {
    await this.formatForm();

    try {
      await AuthService.profile.update(this.state.form);
      const res = await AuthService.profile.get();
      this.props.dispatch({ type: 'SET_USER', payload: res.user.user });
      Globals.sendToast('Configuración actualizada con éxito');

    } catch (error) {
      console.log(error)
    }
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
            <Text style={styles.headerTitle}>Notificaciones</Text>
          </View>

          <View style={{ flex: 1 }}>
            <ItemButton
              label="Sonido"
              onPress={() => this.change(!form.sound, 'sound')}
              value={form.sound}
            />

            <ItemButton
              label="Vibración"
              onPress={() => this.change(!form.vibration, 'vibration')}
              value={form.vibration}
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

const ItemButton = ({ label, onPress, value }) => (
  <TouchableOpacity style={styles.itemBtn} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.itemBtnLabel}>{ label }</Text>
    <Switch
      trackColor={{ true: Colors.blue }}
      thumbColor={Colors.white}
      ios_backgroundColor={Colors.blue}
      value={value}
      onValueChange={onPress}
    />
  </TouchableOpacity>
);

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
  itemBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  itemBtnIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  itemBtnLabel: {
    fontSize: 16,
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
}))(ProfileNotification);