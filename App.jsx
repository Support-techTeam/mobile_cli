/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AppState,
  LogBox,
} from 'react-native';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import {version} from './app.json';
import Toast from 'react-native-toast-message';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/util/redux/store';
import {LightTheme} from './src/constants/lightTheme';
import EnterPin from './src/screens/SecurityScreens/EnterPinScreen';
import {getAllPin} from './src/stores/SecurityStore';
import NetworkStatus from './src/util/NetworkService';
import RNRestart from 'react-native-restart';

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

function App() {
  const appMainState = useRef(AppState.currentState);
  const [appState, setAppState] = useState(appMainState.current);
  const [isLocked, setIsLocked] = useState('');
  const [hasPin, setHasPin] = useState(false);
  const {getItem, setItem} = useAsyncStorage('@lockState');
  const readItemFromStorage = async () => {
    const item = await getItem();
    setIsLocked(item);
  };

  const writeItemToStorage = async newValue => {
    await setItem(newValue);
    setIsLocked(newValue);
  };

  useEffect(() => {
    readItemFromStorage();
  });

  useEffect(() => {
    checkIfPinIsSet();
  }, []);

  const checkIfPinIsSet = async () => {
    const res = await getAllPin();
    if (res?.data?.length > 0) {
      setHasPin(true);
    } else if (res?.data == null) {
      toggleVisibility();
      setHasPin(false);
    } else {
      toggleVisibility();
      setHasPin(false);
    }
  };

  //update check
  useEffect(() => {
    inAppUpdates.checkNeedsUpdate({curVersion: version}).then(result => {
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
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // App becomes inactive or goes to background
        const lockTimer = setTimeout(async () => {
          setIsLocked(true);
          writeItemToStorage('true');
        }, 5000); // Lock after 30 seconds of inactivity

        return () => clearTimeout(lockTimer);
      } else if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App resumes from background or inactive state
        setIsLocked(true);
        writeItemToStorage('true');
      }
      setAppState(nextAppState);
    };

    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateListener.remove();
    };
  }, [appState]);

  // Toggle lock state
  const toggleVisibility = () => {
    setIsLocked(false);
    writeItemToStorage('false');
  };

  const theme = {
    ...LightTheme,
  };

  return (
    <SafeAreaProvider style={styles.rootContainer}>
      <PaperProvider theme={theme}>
        <Portal>
          <DatadogProvider configuration={datadogConfiguration}>
            <StatusBar translucent={true} />
            {isLocked && isLocked === 'true' && hasPin ? (
              <EnterPin toggleVisibility={() => toggleVisibility()} />
            ) : (
              <View style={styles.container}>
                <Provider store={store}>
                  <PersistGate persistor={persistor} loading={null}>
                    <NetworkStatus />
                    <AppNavigationContainer />
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
