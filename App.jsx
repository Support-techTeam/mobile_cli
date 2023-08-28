import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  AppState,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import SplashScreen from 'react-native-splash-screen';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import {version} from './app.json';
import Toast from 'react-native-toast-message';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import EnterPinScreen from './src/screens/EnterPinScreen';

const inAppUpdates = new SpInAppUpdates(true);

function Section({children, title}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
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
      position: 'top', // "top" or "bottom"
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
        // Toast.show({
        //   type: 'info', // "success", "error", "info", "warning"
        //   position: 'top', // "top" or "bottom"
        //   bottomOffset: 20,
        //   text1: 'App Update',
        //   text2: `${result.reason.split(": 1 means there's")[1]}`,
        //   visibilityTime: 3000,
        //   autoHide: false,
        //   onPress: () => Toast.hide(),
        // });
        inAppUpdates.startUpdate(updateOptions);
      } else {
        // Toast.show({
        //   type: 'info', // "success", "error", "info", "warning"
        //   position: 'top', // "top" or "bottom"
        //   bottomOffset: 20,
        //   text1: 'App Update',
        //   text2: `${result.reason.split(": 1 means there's")[1]}`,
        //   visibilityTime: 3000,
        //   autoHide: false,
        //   onPress: () => Toast.hide(),
        // });
      }
    });
  }, []);

  // App State Monitor
  useEffect(() => {
    const handleAppStateChange = async nextAppState => {
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        // App becomes inactive or goes to background
        const lockTimer = setTimeout(async () => {
          setIsLocked(true);
          writeItemToStorage('true');
        }, 3000); // Lock after 30 seconds of inactivity

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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
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
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View>
            <Button title="Show Toast" onPress={showToast} />
          </View>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.tsx</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
