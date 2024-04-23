import React, { useEffect, Suspense } from 'react';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import notifee from '@notifee/react-native';
import { store, persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import NavigationContainer from '#/navigation';
import { Modal } from '#/components';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { ActivityIndicator, View, KeyboardAvoidingView, Platform, PixelRatio } from 'react-native';
import { Colors, Fonts, Styles } from './src/utils';
import { setCustomText } from 'react-native-global-props';
import { RootSiblingParent } from 'react-native-root-siblings';
import GeneralStatusBarColor from "react-native-general-statusbar";
import WaitingModal from './src/modal-waiting';
import { checkMultiple, requestMultiple } from 'react-native-permissions';

const AppContainer = () => {
  const loading = useSelector(state => state.loading);
  const waiting_modal = useSelector(state => state.waiting_modal);
  const dispatch = useDispatch();
  const fontSize = PixelRatio.getFontScale() >= 1 ? 12 : 14;

  useEffect(() => {
    dispatch({
      type: 'QUIT_LOADING'
    });

    dispatch({
      type: 'QUIT_WAITING_MODAL'
    });

    const customTextProps = {
      style: {
        fontFamily: Fonts.REGULAR,
        fontSize,
      }
    }

    setCustomText(customTextProps);
    notifee.setBadgeCount(0).then(() => {}).catch(() => {});

    checkMultiple([
      'android.permission.CAMERA',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ])
      .then(res => {
        requestMultiple([
          'android.permission.CAMERA',
          'android.permission.POST_NOTIFICATIONS',
          'android.permission.READ_EXTERNAL_STORAGE',
          'android.permission.READ_MEDIA_IMAGES',
          'android.permission.WRITE_EXTERNAL_STORAGE',
        ])
        .then(perm => {
        })
        .catch(console.log);
      })
      .catch(() => {});
  }, []);

  return (
    <React.Fragment>
      {loading && (
        <Modal withoutClose={true}>
          <View style={{ padding: 20 }}>
            <ActivityIndicator size={40} color={Colors.blue} />
          </View>
        </Modal>
      )}

      {waiting_modal && (
        <Modal containerStyle={[Styles.modal, {
          backgroundColor: Colors.white
        }]} withoutClose={true}>
          <WaitingModal />
        </Modal>
      )}
      <NavigationContainer>

      </NavigationContainer>
    </React.Fragment>
  )
}

const AvoidingView = (props) => {
  if (Platform.OS == 'ios') {
    return (
      <KeyboardAvoidingView behavior='padding' enabled style={{ flex: 1 }}>
        {props.children}
      </KeyboardAvoidingView>
    )
  }
  else {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {props.children}
      </KeyboardAvoidingView>
    )
  }
}

const App = () => {
  SplashScreen.hide();
  console.disableYellowBox = true;
  GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

  return (
    <View style={{ flex: 1 }}>
      <Suspense fallback="">
        <GeneralStatusBarColor backgroundColor={Colors.background} barStyle="light-content" />
        <RootSiblingParent>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AvoidingView>
                <AppContainer />
              </AvoidingView>
            </PersistGate>
          </Provider>
        </RootSiblingParent>
      </Suspense>
    </View>
  )
}

export default App;
