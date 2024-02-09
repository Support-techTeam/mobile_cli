/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AppState,
  LogBox,
  useColorScheme,
} from 'react-native';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import {version, SCREELOCK_CODE, SCREENLOCK_STATUS} from './app.json';
import Toast from 'react-native-toast-message';
import AppCenter from 'appcenter';
import Analytics from 'appcenter-analytics';
import Crashes from 'appcenter-crashes';
import {
  DatadogProviderConfiguration,
  DatadogProvider,
} from '@datadog/mobile-react-native';
import AppNavigationContainer from './src/navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider, Portal} from 'react-native-paper';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, resetStore, store} from './src/util/redux/store';
import {LightTheme} from './src/constants/lightTheme';
import {DarkTheme} from './src/constants/darkTheme';
import {DefaultTheme} from 'react-native-paper';
import InputPin from './src/screens/SecurityScreens/PinInput';
import NetworkStatus from './src/util/NetworkService';
import RNRestart from 'react-native-restart';
import COLORS from './src/constants/colors';
import {userLogOut} from './src/stores/AuthStore';
import {auth} from './src/util/firebase/firebaseConfig';
import BackgroundTimer from 'react-native-background-timer';
import {TextColorProvider} from './src/component/TextColorContext';
import InitializeSDKHandler from './src/component/appFlyer/InitializeSDKHandler';
import DeviceInfo from 'react-native-device-info';

const inAppUpdates = new SpInAppUpdates(false);

LogBox.ignoreAllLogs();

AppCenter.setLogLevel(AppCenter.LogLevel.VERBOSE);
Analytics.setEnabled(true);
Crashes.setEnabled(true);

const datadogConfiguration = new DatadogProviderConfiguration(
  'pub8927d4ff6dd483f142a70688c6e5fb7f',
  'prod',
  '6848aa7b-c6b5-4797-b087-8aad30149ece',
  true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
  true, // track XHR Resources
  true, // track Errors
);

// Optional: Select your Datadog website (one of "US", "EU" or "GOV")
datadogConfiguration.site = 'US';
// Optional: enable or disable native crash reports
datadogConfiguration.nativeCrashReportEnabled = true;
// Optional: sample RUM sessions (here, 80% of session will be sent to Datadog. Default = 100%)
datadogConfiguration.sampleRate = 80;
const TRANSITIONS = ['fade', 'slide', 'none'];

let inactiveTime = 0;
const defaultWaitTime = Platform.select({ios: 120, android: 120});
let hasLockKey = false;
let screelLockStatus = false;
function App() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [hidden, setHidden] = useState(false);
  const [statusBarTransition, setStatusBarTransition] = useState(
    TRANSITIONS[0],
  );

  //update check
  useEffect(() => {
    inAppUpdates
      .checkNeedsUpdate({curVersion: version})
      .then(result => {
        if (result.shouldUpdate) {
          const updateOptions = Platform.select({
            ios: {
              title: 'Update available',
              message:
                'There is a new version of the app available on the App Store, do you want to update it?',
              buttonUpgradeText: 'Update',
              buttonCancelText: 'Cancel',
            },
            android: {
              updateType: IAUUpdateKind.FLEXIBLE,
            },
          });
          inAppUpdates.startUpdate(updateOptions);
        }
      })
      .catch(err => {
        // console.log('Update Err: ', err);
      });
  }, []);

  useEffect(() => {
    inAppUpdates.addStatusUpdateListener(onStatusUpdate);
    return () => {
      inAppUpdates.removeStatusUpdateListener(onStatusUpdate);
    };
  }, [onStatusUpdate]);

  const onStatusUpdate = status => {
    const {bytesDownloaded, totalBytesToDownload} = status;
    Toast.show({
      type: 'info',
      position: 'top',
      topOffset: 55,
      text1: 'Updating App',
      text2: `Download : ${(bytesDownloaded / 1024).toFixed(
        1,
      )} Kb | Total Size: ${(totalBytesToDownload / 1024).toFixed(1)} Kb`,
      autoHide: false,
    });
    if (totalBytesToDownload === bytesDownloaded) {
      Toast.hide();
      if (Platform.OS === 'android') {
        inAppUpdates.installUpdate();
        if (status.status == '5') {
          RNRestart.restart();
        }
      }
    }
  };

  // App State Monitor
  const logout = async () => {
    if (auth.currentUser) {
      try {
        const logoutResult = await userLogOut();
        if (!logoutResult?.error) {
          await resetStore();
        }
      } catch (error) {
        // :TODO
      }
    }
  };

  let backgroundTaskInterval;
  useEffect(() => {
    // Function to handle background task
    const runBackgroundTask = () => {
      // console.log('Background task is running');
      inactiveTimerCallback();
    };

    // Start the background task
    const startBackgroundTask = () => {
      // console.log('Starting background task...');
      backgroundTaskInterval = BackgroundTimer.setInterval(() => {
        runBackgroundTask();
      }, 5000);
    };

    // Stop the background task
    const stopBackgroundTask = () => {
      // console.log('Stopping background task...');
      inactiveTime = 0;
      BackgroundTimer.clearInterval(backgroundTaskInterval);
    };

    // Listen for changes in app state
    const handleAppStateChange = nextAppState => {
      // console.log('App state changed:', nextAppState);
      if (nextAppState === 'active') {
        // App is in the foreground
        stopBackgroundTask();
      } else if (nextAppState === 'background') {
        // App is in the background
        startBackgroundTask();
      }
    };

    const inactiveTimerCallback = () => {
      inactiveTime = inactiveTime + 5;
      if (inactiveTime >= defaultWaitTime) {
        performAction();
      }
    };
    const performAction = async () => {
      await logout();
    };

    // Subscribe to app state changes
    const appListeener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Initial setup based on the app's initial state
    if (AppState.currentState === 'background') {
      startBackgroundTask();
    }

    if (AppState.currentState === 'active') {
      stopBackgroundTask();
    }

    // Clean up
    return () => {
      appListeener.remove();
      stopBackgroundTask();
    };
  }, []);

  // const retrieveAllSecureInfoData = async () => {
  //   const allData = await SInfo.getAllItems({
  //     sharedPreferencesName: 'tradeLendaSharedPrefs',
  //     keychainService: 'tradeLendaKeychain',
  //   });
  //   console.log('NORMAL GETTING ALL', allData);
  // };

  // Set Passcode to blank
  // const setSecureInfoData = async (option, code) => {
  //   const responseData = await SInfo.setItem(option, code, {
  //     sharedPreferencesName: 'tradeLendaSharedPrefs',
  //     keychainService: 'tradeLendaKeychain',
  //   });
  //   // console.log('NORMAL SETTING', responseData);
  // };

  // const getSecureInfoData = async option => {
  //   const responseData = await SInfo.getItem(option, {
  //     sharedPreferencesName: 'tradeLendaSharedPrefs',
  //     keychainService: 'tradeLendaKeychain',
  //   });
  //   // console.log('NORMAL GETTING', responseData);
  //   if (responseData === null || responseData === undefined) {
  //     hasLockKey = false;
  //   } else {
  //     hasLockKey = true;
  //   }
  // };

  // const getSecureInfoStatus = async option => {
  //   const responseData = await SInfo.getItem(option, {
  //     sharedPreferencesName: 'tradeLendaSharedPrefs',
  //     keychainService: 'tradeLendaKeychain',
  //   });
  //   console.log('NORMAL GETTING', responseData);
  //   if (responseData === null || responseData === undefined) {
  //     screelLockStatus = false;
  //   } else {
  //     if (responseData === 'true') {
  //       screelLockStatus = true;
  //     } else {
  //       screelLockStatus = false;
  //     }
  //   }
  // };

  // const deleteSecureInfoData = async option => {
  //   const responseData = await SInfo.deleteItem(option, {
  //     sharedPreferencesName: 'tradeLendaSharedPrefs',
  //     keychainService: 'tradeLendaKeychain',
  //   });
  //   console.log('NORMAL DELETING', responseData);
  // };

  const colorScheme = useColorScheme();
  // const theme = colorScheme === 'dark' ? {...DefaultTheme} : {...LightTheme};
  const theme = {...DefaultTheme};

  // const deviceId = DeviceInfo.getUniqueId();
  // console.log(Platform.select({ios: 'IOS', android: 'Sndroid'}));
  // console.log('Device Id:', deviceId);

  return (
    <SafeAreaProvider style={styles.rootContainer}>
      <PaperProvider theme={theme}>
        <Portal>
          <DatadogProvider configuration={datadogConfiguration}>
            <StatusBar
              animated={true}
              backgroundColor={COLORS.lendaBlue}
              barStyle={'default'}
              showHideTransition={statusBarTransition}
              hidden={hidden}
            />
            {/*  {isLocked && isLocked === 'true' && hasPin ? (*/}
            {false ? (
              <InputPin />
            ) : (
              <View
                style={styles.container}
                onTouchStart={() => {
                  inactiveTime = 0;
                  BackgroundTimer.clearInterval(backgroundTaskInterval);
                }}>
                <Provider store={store}>
                  <PersistGate persistor={persistor} loading={null}>
                    <TextColorProvider>
                      <InitializeSDKHandler />
                      <NetworkStatus />
                      <AppNavigationContainer />
                    </TextColorProvider>
                  </PersistGate>
                </Provider>
              </View>
            )}
          </DatadogProvider>
        </Portal>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default App;
