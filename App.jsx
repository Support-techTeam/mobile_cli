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
  PermissionsAndroid,
  NativeEventEmitter,
  NativeModules,
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
import BackgroundTimer from 'react-native-background-timer';
import {TextColorProvider} from './src/component/TextColorContext';
import InitializeSDKHandler from './src/component/appFlyer/InitializeSDKHandler';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import RemotePushController from './src/component/push-notifications/RemotePushController';
import messaging from '@react-native-firebase/messaging';
import CustomNotification from './src/component/push-notifications/CustomNotification';
import auth from '@react-native-firebase/auth';
import {requestNotifications} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PinInput from './src/screens/SecurityScreens/PinInput';
import {DataProvider} from './src/context/DataProvider';



const inAppUpdates = new SpInAppUpdates(false);
const deviceInfoEmitter = new NativeEventEmitter(NativeModules.RNDeviceInfo);
LogBox.ignoreAllLogs();

AppCenter.setLogLevel(AppCenter.LogLevel.VERBOSE);
Analytics.setEnabled(true);
Crashes.setEnabled(true);

const datadogConfiguration = new DatadogProviderConfiguration(
  'pub8927d4ff6dd483f142a70688c6e5fb7f',
  'prod',
  '6848aa7b-c6b5-4797-b087-8aad30149ece',
  true, // track User interactions
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
const LOCK_TIMEOUT = 30000; // 1 minute in milliseconds

const requestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    try {
      await requestNotifications(['alert', 'sound', 'badge']);
    } catch (error) {
      // console.log('Error requesting push notification permissions:', error);
    }
    const authStatus = await messaging().requestPermission({
      sound: true,
      announcement: true,
      alert: true,
      badge: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
    } else {
      // console.log('Authorization status:', authStatus);
    }
  } else if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Permission to receive SMS',
          message: 'This app needs access to receive SMS',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      // console.warn(err);
    }
  }
};
function App() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [hidden, setHidden] = useState(false);
  const [statusBarTransition, setStatusBarTransition] = useState(
    TRANSITIONS[0],
  );
  const [locked, setLocked] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

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
    if (auth().currentUser) {
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

  const colorScheme = useColorScheme();
  // const theme = colorScheme === 'dark' ? {...DefaultTheme} : {...LightTheme};
  const theme = {...DefaultTheme};

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    requestUserPermission();
    getDeviceInfo();
  }, []);

  useEffect(() => {
    messaging()
      .getToken()
      .then(fid => {
        // console.log('FCM message:', Platform.OS);
        // console.log('Firebase Installation ID:', fid);
      })
      .catch(error => {
        // console.error('Error getting Firebase Installation ID:', error);
      });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log(remoteMessage.notification);
      const {title, body, android} = remoteMessage.notification;
      const {clickAction, smallIcon, imageUrl, redirectUrl} = android;
      // console.log('Img', imageUrl);
      // console.log('And', android);
      setNotification({title, body, android});
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      console.log('nextAppState', nextAppState);
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setLastActiveTime(Date.now());
      } else if (nextAppState === 'active') {
        const timeSinceLastActive = Date.now() - lastActiveTime;
        if (timeSinceLastActive > LOCK_TIMEOUT) {
          setLocked(true);
          // console.log(locked, 'Set to Lock');
        }
      }
    };

    const interval = setInterval(() => {
      const timeSinceLastActive = Date.now() - lastActiveTime;
      if (
        AppState.currentState === 'active' &&
        timeSinceLastActive > LOCK_TIMEOUT
      ) {
        setLocked(true);
      }
    }, 1000);

    const appListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      clearInterval(interval);
      // AppState.removeEventListener('change', handleAppStateChange);
      appListener.remove();
    };
  }, [lastActiveTime]);

  // Check for timeout every second

  const unlockApp = () => {
    setLocked(false);
    // console.log(locked, 'Set to UnLock');
    setLastActiveTime(Date.now());
  };

  const handleNotificationPress = () => {
    setNotification(null);
  };

  const getDeviceInfo = async () => {
    try {
      let deviceJSON = {};

      new Promise.all([
        DeviceInfo.getIpAddress().then(ip => {
          deviceJSON.ipAddress = ip;
        }),
        DeviceInfo.getMacAddress().then(mac => {
          deviceJSON.macAddress = mac;
        }),
        DeviceInfo.getCarrier().then(carrier => {
          deviceJSON.deviceCarrier = carrier;
        }),
        DeviceInfo.getPhoneNumber().then(phoneNumber => {
          deviceJSON.devicePhoneNumber = phoneNumber;
        }),
        (deviceJSON.brand = DeviceInfo.getBrand()),
        (deviceJSON.bundleId = DeviceInfo.getBundleId()),
        DeviceInfo.getDevice().then(device => {
          deviceJSON.deviceName = device;
        }),
        DeviceInfo.getFingerprint().then(fingerprint => {
          deviceJSON.deviceFingerPrint = fingerprint;
        }),

        (deviceJSON.type = DeviceInfo.getDeviceType()),
        (deviceJSON.Device = Platform.OS),
      ]).then(async () => {
        // set device information
        storeDeviceData(deviceJSON);
      });
    } catch (e) {}
  };

  const storeDeviceData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('deviceInfo', jsonValue);
    } catch (e) {
      // saving error
    }
  };

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
            {/* {locked && locked === true ? ( */}
            {false ? (
              //   <InputPin />
              <PinInput unlockApp={unlockApp} />
            ) : (
              <View
                style={styles.container}
                onTouchStart={() => {
                  inactiveTime = 0;
                  BackgroundTimer.clearInterval(backgroundTaskInterval);
                }}>
                <Provider store={store}>
                  <DataProvider>
                    <PersistGate persistor={persistor} loading={null}>
                      <TextColorProvider>
                        <InitializeSDKHandler />
                        <CustomNotification
                          isVisible={!!notification}
                          title={notification?.title}
                          body={notification?.body}
                          imageUrl={notification?.android?.imageUrl}
                          redirectUrl={notification?.android?.redirectUrl}
                          onPress={handleNotificationPress}
                        />
                        <NetworkStatus />
                        <AppNavigationContainer />
                      </TextColorProvider>
                    </PersistGate>
                  </DataProvider>
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});

export default App;
