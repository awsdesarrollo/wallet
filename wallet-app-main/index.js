/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await AsyncStorage.setItem('last_notification', remoteMessage.notification.title);
});

AppRegistry.registerComponent(appName, () => App);
