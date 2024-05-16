import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useContext,
} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {
  StyleSheet,
  useColorScheme,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
// import {auth} from '../util/firebase/firebaseConfig';
import auth from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen';
import Splashscreen from './Splashscreen';
import NetworkScreen from './NetworkError';
import {useSelector} from 'react-redux';
// import {networkState} from '../util/redux/networkState/network.slice';
import {TabContextProvider} from '../context/TabContext';
import {useData} from '../context/DataProvider';
import CustomNotification from '../component/push-notifications/CustomNotification';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {version} from '../../app.json';
// For Step by Step Walkthrough
import {CopilotStep, walkthroughable, useCopilot} from 'react-native-copilot';
import FastImage from 'react-native-fast-image';
import COLORS from '../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NotificationContext} from '../context/NotificationContext';
import {deleteAsyncData} from '../context/AsyncContext';

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableImage = walkthroughable(FastImage);

const AppNavigationContainer = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const scheme = useColorScheme();
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const networkState = useSelector(state => state.networkState.network);
  const [networkStatus, setNetworkStatus] = useState(true);
  const {dataStore, setDataStore} = useData();
  const [notification, setNotification] = useState(null);
  const {addNotification} = useContext(NotificationContext);

  //walktrrough
  const [mainOpacity, setMainOpacity] = useState(0.6);
  const [componentOpacity, setComponentOpacity] = useState(1);

  // const [secondStepActive, setSecondStepActive] = useState(true);
  const {start, copilotEvents, stop, visible} = useCopilot();
  const [lastEvent, setLastEvent] = useState(null);
  const [isTourFinished, setIsTourFinished] = useState(false);

  useEffect(() => {
    copilotEvents.on('stepChange', step => {
      setLastEvent(`stepChange: ${step.name}`);
      // if (step.name === 'moreSection') {
      //   // navigationRef.navigate('BottomTabs', {screen: 'More'});
      // } else if (step.name === 'walletIndesSection') {
      //   navigationRef.navigate('BottomTabs', {screen: 'More'});
      //   // navigationRef.navigate('WalletIndex');
      // } else if (step.name === 'securitySection') {
      //   // navigationRef.navigate('Security');
      // } else {
      //   navigationRef.navigate('BottomTabs', {screen: 'Home'});
      // }
    });
    copilotEvents.on('start', () => {
      setLastEvent(`start`);
      setMainOpacity(0);
      setComponentOpacity(0);
    });
    copilotEvents.on('stop', () => {
      setLastEvent(`stop`);
      setMainOpacity(0.6);
      setComponentOpacity(1);
    });
  }, [copilotEvents]);

  useEffect(() => {
    const listener = () => {
      // console.log('Copilot tutorial finished!');
      stop();
      // setIsTourFinished(true);
      // Copilot tutorial finished!
    };

    copilotEvents.on('stop', listener);

    return () => {
      copilotEvents.off('stop', listener);
    };
  }, []);

  useLayoutEffect(() => {
    if (
      auth().currentUser === undefined ||
      auth().currentUser === null ||
      auth().currentUser
    ) {
      SplashScreen.hide();
    }
  }, []);

  //auth state change listener
  useLayoutEffect(() => {
    setIsLoading(true);
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser);
        setTimeout(() => {
          setIsLoading(false);
        }, 4000);
      } else {
        setUser(null);
        setTimeout(() => {
          setIsLoading(false);
        }, 4000);
      }
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    if (networkState) {
      setNetworkStatus(
        networkState?.isConnected && networkState?.isInternetReachable
          ? true
          : false,
      );
    }
  }, [networkState]);

  // refresh token
  useEffect(() => {
    const checkAndRenewToken = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken(true);
        } else {
        }
      } catch (error) {}
    };
    const intervalCheck = setInterval(checkAndRenewToken, 600000);

    return () => clearInterval(intervalCheck);
  }, []);

  useLayoutEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // Add a new notification
  const handleAddNotification = async (
    title,
    body,
    android,
    redirectUrl,
    state,
  ) => {
    await deleteAsyncData({storage_name: 'tradelenda_notifications'});
    const dateObj = new Date(Date.now());
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const time = `${hours}:${minutes}`;

    addNotification({
      id: Date.now(), // Unique ID for the notification
      time: time,
      title: title,
      description: body,
      lineColor: COLORS.lendaBlue,
      viewed: state,
      android: android,
      redirectUrl: redirectUrl,
    });
  };

  const handleNotificationPress = () => {
    setNotification(null);
  };

  async function onBackgroundMessageReceived(message) {
    try {
      await notifee.requestPermission();
      const {from, collapseKey, data, messageId, notification, sentTime, ttl} =
        message;
      const {title, body, android} = notification;
      const {redirectUrl} = data;
      await notifee.displayNotification({
        title: title,
        body: body,
        android: android,
      });
      const state = false;
      handleAddNotification(title, body, android, redirectUrl, state);
    } catch (e) {
      // console.log(e);
    }
  }

  async function onForegroundMessageReceived(message) {
    try {
      await notifee.requestPermission();
      const {from, collapseKey, data, messageId, notification, sentTime, ttl} =
        message;
      const {title, body, android} = notification;
      const {redirectUrl} = data;
      setNotification({title, body, android, redirectUrl});
      const state = true;
      handleAddNotification(title, body, android, redirectUrl, state);
    } catch (e) {
      // console.log(e);
    }
  }

  messaging().onMessage(onForegroundMessageReceived);
  messaging().setBackgroundMessageHandler(onBackgroundMessageReceived);
  messaging().onNotificationOpenedApp(remoteMessage => {
    onForegroundMessageReceived(remoteMessage);
  });

  const featureIntro = () => {
    return (
      <View
        style={{
          position: 'absolute',
          zIndex: 99999999,
          backgroundColor: `rgba(0,0,0,${mainOpacity})`,
          justifyContent: 'center',
          alignItems: 'center',
          width: wp('100%'),
          height: hp('100%'),
        }}>
        <WalkthroughableText
          style={[
            styles.title,
            {
              color: COLORS.white,
              paddingVertical: 60,
              opacity: componentOpacity,
            },
          ]}>
          {`Welcome to Trade Lenda App \nv${version}\nnew features intro.`}
        </WalkthroughableText>

        <View style={[styles.middleView, {opacity: componentOpacity}]}>
          <View
            style={{
              backgroundColor: COLORS.white,
              width: 160,
              height: 160,
              borderRadius: 80,
              marginVertical: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <WalkthroughableImage
              source={{
                uri: 'https://tradelenda.com/images/logos/TradeLendaLOGO.png',
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
              style={[styles.profilePhoto]}
            />
          </View>
          <View
            style={[
              styles.activeSwitchContainer,
              {opacity: componentOpacity},
            ]}></View>

          <TouchableOpacity
            style={[styles.button, {opacity: componentOpacity}]}
            onPress={() => start()}>
            <Text style={styles.buttonText}>START FEATURES INTRO!</Text>
          </TouchableOpacity>
          <View style={styles.eventContainer}></View>
        </View>
      </View>
    );
  };
  return (
    <TabContextProvider>
      <NavigationContainer
        theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute();
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute();
        }}>
        <CustomNotification
          isVisible={notification === null ? false : true}
          title={notification?.title}
          body={notification?.body}
          imageUrl={notification?.android?.imageUrl}
          redirectUrl={notification?.redirectUrl}
          onPress={handleNotificationPress}
          navigationRef={navigationRef}
          insideRoute={false}
        />
        {isLoading && <Splashscreen text="Checking Authentication..." />}
        {user ? (
          networkStatus ? (
            <>
              {/* {!isTourFinished && featureIntro()} */}
              <AppStack />
            </>
          ) : (
            <NetworkScreen />
          )
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </TabContextProvider>
  );
};

export default AppNavigationContainer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  profilePhoto: {
    width: 130,
    height: 130,
  },
  middleView: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.lendaBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabItem: {
    textAlign: 'center',
  },
  activeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  eventContainer: {
    marginTop: 20,
  },
});
