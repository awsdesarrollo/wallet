import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Path, Svg } from 'react-native-svg';
import { FastImage } from '.';
import { Colors, Fonts, Globals } from '../utils';
import { EllipsisIcon, NotificationIcon, UserIcon } from '../assets/icons';
import { Logo } from '../assets/img';

const HEADER_HEIGHT = 60;

class CustomHeader extends React.Component {

  state = {
    showNotification: false,
  }

  goToNotifications= () => {
    !!this.props.last_notification
      ? this.setState({ showNotification: true })
      : Globals.sendToast('No se han recibido notificaciones');
  }

  showOptions = () => {

  }

  render() {

    const { last_notification, user } = this.props;

    return (
      <>
        {this.state.showNotification && (
          <Modal
            visible
            transparent
            animationType="fade"
            onRequestClose={() => this.setState({ showNotification: false })}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.setState({ showNotification: false })}
              activeOpacity={1}
            >
              <View style={nStyle.modal}>
                <View style={nStyle.tip}>
                  <Svg width={16} height={16} viewBox="0 0 10 10">
                    <Path d="M0 10 L5 0 L10 10 Z" strokeWidth="1" stroke="gray" fill="gray" />
                  </Svg>
                </View>
                <View style={nStyle.container}>
                  <Image source={Logo} style={nStyle.logo} />
                  <Text style={nStyle.title}>{ last_notification }</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        <View style={styles.header}>
          <View style={styles.headerImageWrapper}>
            <FastImage
              source={
                !!user?.photo
                  ? { uri: Globals.fromPhotos(user?.photo) }
                  : UserIcon
              }
              style={styles.headerImage(!!user?.photo)}
            />
          </View>
          <View style={[styles.headerRow, { flex: 1 }]}>
            <View>
              <Text style={styles.headerTitle}>{ this.props.title ?? '' }</Text>
              <Text style={styles.headerName}>{ user?.name }</Text>
            </View>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={this.goToNotifications}>
                <Image source={NotificationIcon} style={styles.headerIcon} fadeDuration={0} />
              </TouchableOpacity>

              <View style={{ width: 10 }} />

              <TouchableOpacity onPress={this.showOptions}>
                <Image source={EllipsisIcon} style={styles.headerIcon} fadeDuration={0} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    )
  }
}

const nStyle = StyleSheet.create({
  modal: {
    padding: 10,
    position: 'relative',
  },
  container: {
    backgroundColor: 'gray',
    padding: 10,
    top: HEADER_HEIGHT,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tip: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: HEADER_HEIGHT - 5,
    right: 47,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  title: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontFamily: Fonts.SEMIBOLD,
    fontSize: 16,
  },
  headerName: {
    color: Colors.white,
    fontSize: 16,
  },
  headerImageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.blue,
  },
  headerImage: (hasImage) => ({
    backgroundColor: Colors.white,
    height: hasImage ? 50 : 26,
    width: hasImage ? 50 : 26,
    resizeMode: 'cover',
  }),
  headerIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});

export default connect(state => ({
  user: state.user,
  last_notification: state.last_notification,
}))(CustomHeader);