/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  AppState,
  LogBox,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
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
// import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import AppNavigationContainer from './src/navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider, MD3LightTheme} from 'react-native-paper';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/util/redux/store';

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
  // const insets = useSafeAreaInsets();

  const appMainState = useRef(AppState.currentState);
  const [appState, setAppState] = useState(appMainState.current);
  const [isLocked, setIsLocked] = useState('');
  const {getItem, setItem} = useAsyncStorage('@lockState');
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (isLocked !== '') {
        SplashScreen.hide();
      }
    }
  });

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

  const showToast = () => {
    Toast.show({
      type: 'success', // "success", "error", "info", "warning"
      position: 'bottom', // "top" or "bottom"
      bottomOffset: 20,
      text1: 'Toast Message',
      text2: 'This is a toast message.',
      visibilityTime: 3000,
      autoHide: true,
      onPress: () => Toast.hide(),
    });
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

        console.log(result);
        inAppUpdates.startUpdate(updateOptions);
      }
    });
  }, []);

  // App State Monitor
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // App becomes inactive or goes to background
        const lockTimer = setTimeout(async () => {
          // setIsLocked(true);
          // writeItemToStorage('true');
          setIsLocked(false);
          writeItemToStorage('false');
        }, 30000); // Lock after 30 seconds of inactivity

        return () => clearTimeout(lockTimer);
      } else if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App resumes from background or inactive state
        setIsLocked(false);
        writeItemToStorage('false');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState]);

  // Toggle lock state
  const toggleLock = () => {
    writeItemToStorage(isLocked === 'true' ? 'false' : 'true');
  };

  const theme = {
    ...MD3LightTheme, // or MD3DarkTheme
    roundness: 2,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#3498db',
      secondary: '#f1c40f',
      tertiary: '#a1b2c3',
      secondaryContainer: '#054B99',
    },
  };

  return (
    <SafeAreaProvider style={styles.rootContainer}>
      <PaperProvider theme={theme}>
        <DatadogProvider configuration={datadogConfiguration}>
          <StatusBar translucent={true} />
          {isLocked && isLocked === 'true' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <Text>Locked: Reauthentication Required</Text>

              <Button title="Toggle Lock" onPress={toggleLock} />
            </View>
          ) : (
            <View style={styles.container}>
              <Provider store={store}>
                <PersistGate persistor={persistor} loading={null}>
                  <AppNavigationContainer />
                </PersistGate>
              </Provider>
            </View>
          )}
        </DatadogProvider>
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
