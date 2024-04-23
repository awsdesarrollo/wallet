// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { Platform, Alert } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Config from 'react-native-config';
const env = Config;

class GeolocationController {
  start() {
    // if (Platform.OS === 'ios') {
    //     BackgroundTimer.runBackgroundTimer( () => BackgroundGeolocation.getCurrentLocation( this.process ), 500);
    // } else {
    //     BackgroundGeolocation.configure({
    //         desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    //         stationaryRadius: 50,
    //         distanceFilter: 50,
    //         notificationTitle: env.APP_NAME,
    //         notificationText: 'Monitoreando',
    //         //debug: false,
    //         startOnBoot: false,
    //         stopOnTerminate: true,
    //         locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    //         interval: 5000,
    //         fastestInterval: 2500,
    //         activitiesInterval: 5000,
    //         stopOnStillActivity: false,
    //         url: env.SOCKET,
    //         saveBatteryOnBackground: false,
            
    //     });

    //     BackgroundGeolocation.on('location', this.process);

    //     BackgroundGeolocation.on('authorization', (status) => {
    //         console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
    //         if (status !== BackgroundGeolocation.AUTHORIZED) {
    //           // we need to set delay or otherwise alert may not be shown
    //           setTimeout(() =>
    //             Alert.alert('Wallet', 'Wallet recopila datos de ubicación en segundo plano para permitir recibir notificaciones incluso cuando la aplicación no está en uso', [
    //               { text: 'Aprobar', onPress: () => BackgroundGeolocation.showAppSettings() },
    //               { text: 'Denegar', onPress: () => console.log('No Pressed'), style: 'cancel' }
    //             ]), 1000);
    //         }
    //     });

    //     BackgroundGeolocation.start();
    // }
  }
}

export default new GeolocationController();