import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { Colors, Fonts, Globals, Media } from '../../../utils';
import { Menu, ScreenContainer } from '../../../components';
import { AuthService } from '../../../services';
import { Logo, WhiteImage } from '../../../assets/img';
import { EditAltIcon, LogoutIcon, NotificationAltIcon, UserAltIcon } from '../../../assets/icons';

class ProfileMain extends React.Component {

  componentDidMount() {
    this.props.navigation.setParams({
      title: 'Perfil',
      hideHeader: true,
      containerStyle: {
        backgroundColor: Colors.blue
      },
      iconStyle: {
        tintColor: Colors.white,
      },
      titleStyle: {
        color: Colors.white,
      },
    });
  }

  // onSelectPhoto = async () => {
  //   Media.get().then(async (image) => {
  //     if (!image) return;
  //     await this.change(image, 'photo');
  //     try {
  //       const res = await AuthService.profile.update({
  //         id: this.props.user.id,
  //         bankName: this.props.user.bank.bank_name,
  //         bankNumber: this.props.user.bank.account_number,
  //         bankRoute: this.props.user.bank.route_number,
  //         photo: image,
  //         hasFile: true,
  //       });

  //       this.props.dispatch({ type: 'SET_USER', payload: res });

  //     } catch (error) {
  //       console.log(error?.response?.data?.error, error)
  //     }
  //   });
  // }

  goTo = (page, type = 'default') => {
		if (type === 'default') this.props.navigation.navigate(page)
		else {
			this.props.navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [ { name: page } ],
				})
			)
		}
  }

  render() {

    const { user } = this.props;
    const hasCurrentPhoto = user?.photo ? { uri: Globals.fromPhotos(user?.photo) } : WhiteImage;
    const photo = !!user?.photo?.uri ? user?.photo : hasCurrentPhoto;

    return (
      <>
        <ScreenContainer backgroundColor={Colors.background}>
          <View style={styles.header}>
            <Image source={Logo} style={styles.headerLogo} />
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          <View style={styles.avatar}>
            <View style={styles.photoContainer}>
              <View>
                <TouchableOpacity
                  style={[styles.photoWrapper, { borderWidth: 0 }]}
                  onPress={this.onSelectPhoto}
                  activeOpacity={0.8}
                >
                  <Image source={photo} style={styles.photo} />
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.photoBtn} onPress={() => {}} activeOpacity={0.8}>
                  <Image source={EditAltIcon} style={styles.photoBtnIcon} />
                </TouchableOpacity> */}
              </View>
            </View>

            <Text style={styles.avatarName}>{ this.props.user?.name }</Text>
            <Text style={styles.avatarEmail}>{ this.props.user?.email }</Text>
          </View>

          <ItemButton
            label="Perfil"
            icon={UserAltIcon}
            onPress={() => this.goTo('Profile')}
          />

          <ItemButton
            label="Notificaciones"
            icon={NotificationAltIcon}
            onPress={() => this.goTo('ProfileNotifications')}
          />

          <ItemButton
            label="Salir"
            icon={LogoutIcon}
            onPress={() => this.goTo('Logout', 'redirect')}
            color={Colors.danger}
          />

        </ScreenContainer>

        <Menu />
      </>
    )
  }
}

const ItemButton = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.itemBtn} onPress={onPress}>
    <Image
      source={icon}
      style={[styles.itemBtnIcon, { tintColor: color || Colors.white }]}
    />
    <Text style={[styles.itemBtnLabel, { color: color || Colors.white }]}>
      { label }
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontFamily: Fonts.SEMIBOLD,
    fontSize: 24,
    color: Colors.white,
    marginLeft: 10,
  },
  avatar: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  avatarName: {
    fontFamily: Fonts.SEMIBOLD,
    fontSize: 28,
    color: Colors.white,
    textAlign: 'center',
  },
  avatarEmail: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: 5,
  },
  photoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoWrapper: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    backgroundColor: Colors.white,
    borderColor: Colors.gray2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: 130,
    height: 130,
    resizeMode: 'cover',
  },
  photoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: Colors.blue,
    borderRadius: 6,
    borderBottomLeftRadius: 0,
  },
  photoBtnIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: Colors.background,
  },
  itemBtn: {
    flexDirection: 'row',
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
    marginLeft: 20,
    fontFamily: Fonts.SEMIBOLD,
    fontSize: 16,
    color: Colors.white,
  },
});

export default connect((state) => ({
  user: state.user
}))(ProfileMain);