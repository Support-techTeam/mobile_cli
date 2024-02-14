import React, {useLayoutEffect, useRef, useState, useEffect} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
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

const AppNavigationContainer = () => {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const scheme = useColorScheme();
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const networkState = useSelector(state => state.networkState.network);
  const [networkStatus, setNetworkStatus] = useState(true);

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

    // Clean up the listener when the component unmounts
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

  //refresh token
  useEffect(() => {
    const checkAndRenewToken = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken(true);
        } else {
        }
      } catch (error) {
        // console.error('Error renewing token:', error);
      }
    };
    const intervalCheck = setInterval(checkAndRenewToken, 600000);

    return () => clearInterval(intervalCheck);
  }, []);
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
        {isLoading ? (
          <Splashscreen text="Checking Authentication..." />
        ) : user ? (
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
