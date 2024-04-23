import React from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import { connect } from 'react-redux';
import { AuthService, FirebaseService } from '#/services';
import { SocketEvents } from '#/utils';
import { navigationRef } from './root-navigation';
import { CommonActions } from '@react-navigation/native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

class FirebaseContainer extends React.Component {

  componentDidMount() {
    this.createChannels();
    this.addFirebase();
  }

  addFirebase = async () => {
    await notifee.requestPermission();
    await firebase.messaging().requestPermission();
    this.getToken();

    /*
       Se escuchan las notificaciones,
       funciona SOLO cuando la app esta abierta.
       Cuando esta cerrada llegan de manera nativa.
    */
    firebase.messaging().onMessage(async (remoteMessage) => {

      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        data: remoteMessage.data,
        android: {
          channelId: remoteMessage.notification.android.channelId,
          color: '#0000fe',
          smallIcon: '@drawable/icon',
          importance: AndroidImportance.HIGH
        },
        ios: {
          sound: "default",
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          }
        }
      });

      const data = JSON.parse(remoteMessage.data?.data);
      if (data?.event === SocketEvents.ORDER.REJECTED) {
        this.refreshProfile();
      }

      await notifee.incrementBadgeCount();
      this.setLastNotification(remoteMessage.notification);
    });

    // Escucha cuando se presiona una notificación estando la aplicación abierta (En background)
    firebase.messaging().onNotificationOpenedApp(async (remoteMessage) => {
      await notifee.decrementBadgeCount();
      this.setLastNotification(remoteMessage.notification);
      this.actionNotification(JSON.parse(remoteMessage.data.data));
    });

    firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      
    })

    // Escucha cuando se presiona una notificación estando la aplicación abierta (En foreground)
    notifee.onForegroundEvent(async ({ type, detail }) => {
      const payload = JSON.parse(detail.notification.data.data);

      if (type == EventType.PRESS) {
        await notifee.decrementBadgeCount();
        await notifee.cancelNotification(detail.notification.id);
        this.setLastNotification(detail.notification);
        this.actionNotification(payload);
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const payload = JSON.parse(detail.notification.data.data);

      if (type === EventType.ACTION_PRESS) {
        await notifee.decrementBadgeCount();
        await notifee.cancelNotification(detail.notification.id);
        this.setLastNotification(detail.notification);
        this.actionNotification(payload);
      }
    });

    // Escucha cuando la aplicación esta cerrada completamente y se presiona una notificación
    const notification = await firebase.messaging().getInitialNotification();
    if (notification) {
      await notifee.decrementBadgeCount();
      this.setLastNotification(notification.notification);
      this.actionNotification(JSON.parse(notification.notification.data.data));
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

  setLastNotification = async (notification) => {
    await this.props.dispatch({
      type: 'SET_LAST_NOTIFICATION',
      payload: notification.title,
    });
  }

  createChannels = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default',
      sound: 'default',
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    await notifee.createChannel({
      id: 'no-sound',
      name: 'No Sound',
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    await notifee.createChannel({
      id: 'no-vibration',
      name: 'No Vibration',
      sound: 'default',
      vibration: false,
      importance: AndroidImportance.HIGH,
    });

    await notifee.createChannel({
      id: 'none',
      name: 'None',
      vibration: false,
      importance: AndroidImportance.HIGH,
    });
  }

  getToken = async () => {
    // Se solicita el token de firebase para registrarlo en la BD
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      this.registerToken(fcmToken);
      firebase.messaging().onTokenRefresh((fcmToken) => {
        this.registerToken(fcmToken);
      });
    }
  }

  registerToken = async (fcmToken) => {
    // Se registra el token en la tabla 'tokens' de la BD
    await this.props.dispatch({
      type: 'SET_FIREBASE',
      payload: fcmToken,
    });
    if (this.props.user) {
      await FirebaseService.create({
        withoutLoading: true,
        token: fcmToken,
        user_id: this.props.user?.id
      });
    }    
  }

  actionNotification = async (payload) => {
    const navigation = navigationRef?.current;
    if (this.props.user) {
      switch (payload.event) {
        // case SocketEvents.CHAT.NEW_MESSAGE:
        //   navigation.dispatch(
        //     CommonActions.navigate({
        //       name: 'Chat'
        //     })
        //   );
        // break;
        // case SocketEvents.ROUTE.NEW_ROUTE:
        //   const route = JSON.parse(payload.data);
        //   if (this.props.user.level_id === Constants.LEVELS.DRIVER && route?.drivers_ids?.includes(this.props.user.id)) {
        //     DeviceEventEmitter.emit(SocketEvents.ROUTE.NEW_ROUTE, { ...route, driver_id: this.props.user.id });
        //   }

        //   navigation.dispatch(
        //     CommonActions.navigate({
        //       name: 'Home'
        //     })
        //   );
        // break;
        // case SocketEvents.ROUTE.ROUTE_ACCEPTED:
        //   navigation.dispatch(
        //     CommonActions.navigate({
        //       name: 'Home'
        //     })
        //   );
        // break;
        case SocketEvents.USER.DISABLE_USER:
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Logout'
            })
          );
        break;
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        { this.props.children }
      </React.Fragment>
    )
  }
}

export default connect(state => {
  return {
    firebase: state.firebase,
    user: state.user
  }
})(FirebaseContainer);