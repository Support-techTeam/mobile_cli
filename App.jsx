/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AppState,
  LogBox,
  useColorScheme,
  PermissionsAndroid,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  NativeModules,
  Button,
  Alert,
} from 'react-native';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import {version} from './app.json';
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
import NetworkStatus from './src/util/NetworkService';
import RNRestart from 'react-native-restart';
import COLORS from './src/constants/colors';
import {userLogOut} from './src/stores/AuthStore';
import {TextColorProvider} from './src/component/TextColorContext';
import InitializeSDKHandler from './src/component/appFlyer/InitializeSDKHandler';
import DeviceInfo from 'react-native-device-info';
import RemotePushController from './src/component/push-notifications/RemotePushController';
import messaging, {firebase} from '@react-native-firebase/messaging';
import CustomNotification from './src/component/push-notifications/CustomNotification';
import auth from '@react-native-firebase/auth';
import {
  request,
  PERMISSIONS,
  requestNotifications,
} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DataProvider} from './src/context/DataProvider';
import {Settings} from 'react-native-fbsdk-next';
import notifee from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';

const inAppUpdates = new SpInAppUpdates(false);
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

const TIMEOUT_DURATION = 120000;

const requestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    try {
      const {status, settings} = await requestNotifications([
        'alert',
        'sound',
        'badge',
      ]);
      // console.log("Notification permissions status:", status);
      // console.log("Notification settings:", settings);
    } catch (error) {}
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
    } else {
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

const requestNotificationPermission = async () => {
  if (Platform.OS === 'ios') {
    await request(PERMISSIONS.IOS.NOTIFICATIONS);
  }
};

function App() {
  const [hidden, setHidden] = useState(false);
  const [statusBarTransition, setStatusBarTransition] = useState(
    TRANSITIONS[0],
  );
  const [notification, setNotification] = useState(null);
  // const {BackgroundFetch} = NativeModules;
  //Facebook SDK integration
  useEffect(() => {
    Settings.setAppID('225305113437958');
    Settings.setAdvertiserTrackingEnabled(true);
    Settings.initializeSDK();
  }, []);

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
      .catch(err => {});
  }, []);
  // Update installation process
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

  // App state check
  // useEffect(() => {
  //   const handleAppStateChange = async nextAppState => {
  //     if (nextAppState === 'background') {
  //       // console.log('App is in background || inactive', nextAppState);
  //       // setIsLoading(true);
  //       // Save current time in AsyncStorage when app goes to background
  //       await AsyncStorage.setItem(
  //         'backgroundTime',
  //         new Date().getTime().toString(),
  //       );
  //     } else if (nextAppState === 'active') {
  //       // console.log('App is active', nextAppState);
  //       // Check time difference when app returns to active state
  //       const backgroundTime = await AsyncStorage.getItem('backgroundTime');
  //       if (backgroundTime) {
  //         const currentTime = new Date().getTime();
  //         const timeDifference = currentTime - parseInt(backgroundTime);

  //         if (timeDifference > TIMEOUT_DURATION) {
  //           // Lock the user if more than 120,000 seconds have passed
  //           await AsyncStorage.removeItem('backgroundTime');
  //           // console.log('App is Logged Out');
  //           await logout();
  //           // Perform user lock actions
  //         } else {
  //           // Clear stored time if less than 120,000 seconds have passed
  //           await AsyncStorage.removeItem('backgroundTime');
  //         }
  //       }
  //     }
  //   };
  //   // Subscribe to app state changes

  //   const appStateSubscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );

  //   return () => {
  //     // Remove the app state change listener when the component unmounts
  //     try {
  //       appStateSubscription.remove();
  //     } catch (e) {}
  //   };
  // }, []);

  useEffect(() => {
    const handleAppState = async nextAppState => {
      console.log('nextAppState', nextAppState);
      handleAppStateChange(nextAppState);
    };

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppState,
    );

    return () => {
      try {
        appStateSubscription.remove();
      } catch (err) {}
    };
  }, []);

  const handleAppStateChange = async nextAppState => {
    if (nextAppState === 'background') {
      // Save current time in AsyncStorage when app goes to background
      await AsyncStorage.setItem(
        'backgroundTime',
        new Date().getTime().toString(),
      );
    } else if (nextAppState === 'active') {
      const backgroundTime = await AsyncStorage.getItem('backgroundTime');
      if (backgroundTime) {
        const currentTime = new Date().getTime();
        const timeDifference = (currentTime - parseInt(backgroundTime)) / 1000; // Convert to seconds

        // console.log('timeDifference', timeDifference);
        if (timeDifference > 120) {
          // 2 minutes = 120 seconds
          // Lock the user if more than 2 minutes have passed
          await AsyncStorage.removeItem('backgroundTime');
          await logout(); // Perform logout operation
        } else {
          // Clear stored time if less than 2 minutes have passed
          await AsyncStorage.removeItem('backgroundTime');
        }
      }
    }
  };

  const theme = {...LightTheme};

  useEffect(() => {
    requestUserPermission();
    requestNotificationPermission();
    getDeviceInfo();
  }, []);

  // push notification
  useEffect(() => {
    messaging()
      .getToken()
      .then(fid => {
        console.log('FCM message:', Platform.OS);
        console.log('Firebase Installation ID:', fid);
      })
      .catch(error => {
        // console.error('Error getting Firebase Installation ID:', error);
      });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onMessageReceived(remoteMessage);
      // console.log('Listening');
      // console.log(remoteMessage.notification);
      const {title, body, android} = remoteMessage.notification;
      const {clickAction, smallIcon, imageUrl, redirectUrl} = android;
      // console.log('Img', imageUrl);
      // console.log('And', android);
      setNotification({title, body, android});
    });

    return unsubscribe;
  }, []);

  // push notification
  useEffect(() => {
    const onMessageReceived = async remoteMessage => {
      console.log('Background/Quit Notification:', remoteMessage);
      // Handle background/quit notifications
      const {title, body, android} = remoteMessage.notification;
      const {clickAction, smallIcon, imageUrl, redirectUrl} = android;
      // console.log('Img', imageUrl);
      // console.log('And', android);
      setNotification({title, body, android});
    };

    const unsubscribeForeground = messaging().onMessage(onMessageReceived);

    const handleAppStateChange = nextAppState => {
      if (Platform.OS === 'ios' && nextAppState === 'active') {
        unsubscribeBackground && unsubscribeBackground();
        unsubscribeBackground =
          messaging().setBackgroundMessageHandler(onMessageReceived);
      }
    };

    let unsubscribeBackground;

    const appListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      unsubscribeForeground();
      appListener.remove();
    };
  }, []);

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

  function onMessageReceived(message) {
    console.log('message', message);
    notifee.displayNotification(JSON.parse(message.data.notifee));
  }

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

            <View style={styles.container}>
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
