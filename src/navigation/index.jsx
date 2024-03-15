import React, {useLayoutEffect, useRef, useState, useEffect} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {Animated, useColorScheme} from 'react-native';
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

  const handleNotificationPress = () => {
    setNotification(null);
  };

  async function onBackgroundMessageReceived(message) {
    await notifee.requestPermission();
    const {from, collapseKey, data, messageId, notification, sentTime, ttl} =
      message;
    const {title, body, android} = notification;
    await notifee.displayNotification({
      title: title,
      body: body,
      android: android,
    });
  }

  async function onForegroundMessageReceived(message) {
    await notifee.requestPermission();
    const {from, collapseKey, data, messageId, notification, sentTime, ttl} =
      message;
    const {title, body, android} = notification;
    const {redirectUrl} = data;
    setNotification({title, body, android, redirectUrl});
  }

  messaging().onMessage(onForegroundMessageReceived);
  messaging().setBackgroundMessageHandler(onBackgroundMessageReceived);
  messaging().onNotificationOpenedApp(remoteMessage => {
    onForegroundMessageReceived(remoteMessage);
  });

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
        />
        {isLoading && <Splashscreen text="Checking Authentication..." />}
        {user ? (
          networkStatus ? (
            <AppStack />
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
